import { Assessment, Question, Answer } from "../types";

export interface GradingResult {
  score: number; // raw points
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  questionResults: QuestionGradingResult[];
}

export interface QuestionGradingResult {
  questionId: string;
  pointsEarned: number;
  pointsPossible: number;
  status: "correct" | "incorrect" | "partial";
  feedback?: string;
}

/**
 * Calculates the score for an assessment submission.
 * @param assessment The assessment definition
 * @param responses A map of questionId to selected answerIds (for choice) or text (for open-ended)
 * @returns GradingResult
 */
export function calculateAssessmentScore(
  assessment: Assessment,
  responses: Record<string, string | string[]>
): GradingResult {
  const { scoringType } = assessment.settings;
  let totalPointsEarned = 0;
  let totalPointsPossible = 0;
  
  const questionResults: QuestionGradingResult[] = assessment.questions.map((question) => {
    const userResponse = responses[question.id];
    const pointsPossible = question.points;
    totalPointsPossible += pointsPossible;
    
    let pointsEarned = 0;
    let status: "correct" | "incorrect" | "partial" = "incorrect";
    
    if (question.type === "single_choice") {
      const selectedId = userResponse as string;
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (selectedId === correctAnswer?.id) {
        pointsEarned = pointsPossible;
        status = "correct";
      }
    } 
    else if (question.type === "multiple_choice") {
      const selectedIds = (userResponse as string[]) || [];
      const correctAnswers = question.answers.filter(a => a.is_correct);
      const correctAnswerIds = correctAnswers.map(a => a.id);
      
      const allCorrectSelected = correctAnswerIds.every(id => selectedIds.includes(id));
      const noIncorrectSelected = selectedIds.every(id => correctAnswerIds.includes(id));
      
      const activeScoringType = question.scoring_type || scoringType;

      if (allCorrectSelected && noIncorrectSelected) {
        pointsEarned = pointsPossible;
        status = "correct";
      } else if (activeScoringType === "partial") {
        // Check if answers have individual points assigned
        const hasIndividualPoints = question.answers.some(a => (a.points ?? 0) > 0);

        if (hasIndividualPoints) {
          // Sum points for correct answers selected, subtract for incorrect if defined (or just sum correct)
          pointsEarned = selectedIds.reduce((sum, id) => {
            const answer = question.answers.find(a => a.id === id);
            if (answer && answer.is_correct) {
              return sum + (answer.points || 0);
            }
            return sum;
          }, 0);
          status = pointsEarned > 0 ? (pointsEarned >= pointsPossible ? "correct" : "partial") : "incorrect";
        } else {
          // Standard partial credit calculation:
          // (number of correct answers selected - number of incorrect answers selected) / total correct
          // but never less than 0
          const correctSelected = selectedIds.filter(id => correctAnswerIds.includes(id)).length;
          const incorrectSelected = selectedIds.length - correctSelected;
          const netCorrect = Math.max(0, correctSelected - incorrectSelected);
          
          pointsEarned = (netCorrect / correctAnswerIds.length) * pointsPossible;
          status = pointsEarned > 0 ? "partial" : "incorrect";
        }
      }
      // If binary, any error results in 0 (which is default status incorrect)
    }
    else if (question.type === "open_ended") {
      // Open-ended requires manual grading, default to 0 for now
      // Logic could include keyword matching if requested, but manual is specified
      status = "incorrect";
      pointsEarned = 0;
    }

    totalPointsEarned += pointsEarned;

    return {
      questionId: question.id,
      pointsEarned,
      pointsPossible,
      status,
      feedback: pointsEarned === pointsPossible 
        ? (question.correct_feedback || "Well done! Correct.") 
        : (question.incorrect_feedback || "Incorrect. Review the material.")
    };
  });

  const percentage = totalPointsPossible > 0 ? (totalPointsEarned / totalPointsPossible) * 100 : 0;
  const isPassed = percentage >= assessment.passing_score;

  return {
    score: totalPointsEarned,
    maxScore: totalPointsPossible,
    percentage,
    isPassed,
    questionResults
  };
}
