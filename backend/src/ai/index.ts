/**
 * AI assistants. Matching / disease / price stay stubs.
 * The chat assistant uses a free on-platform guide, plus Gemini or Groq if a free key is set.
 */

import prisma from '../database/prisma';
import { ROLE_NAMES } from '../constants/roles';
import { AppError } from '../utils/errors';
import { composeGuideAnswer } from './platformKnowledge';
import { askFreeLlm, type AssistantTurn } from './llm';

export interface MatchCandidate {
  farmerId: string;
  score: number;
  reason: string;
}

export class MatchingService {
  /** Future: embeddings + vector DB (Pinecone, pgvector) */
  async findMatches(_buyerId: string, _commodityId?: number): Promise<MatchCandidate[]> {
    return [];
  }
}

export class AssistantService {
  async ask(
    userId: string,
    roleId: number,
    rawQuestion: unknown,
    rawHistory?: unknown
  ): Promise<{ answer: string; provider: 'guide' | 'gemini' | 'groq' | 'openai' }> {
    const question = typeof rawQuestion === 'string' ? rawQuestion.trim() : '';
    if (question.length < 1) {
      throw new AppError(400, 'Please type a question.');
    }
    if (question.length > 2000) {
      throw new AppError(400, 'Please keep the question under 2,000 characters.');
    }

    const history: AssistantTurn[] = Array.isArray(rawHistory)
      ? rawHistory
          .filter((turn): turn is AssistantTurn => {
            if (!turn || typeof turn !== 'object') return false;
            const role = (turn as AssistantTurn).role;
            const text = (turn as AssistantTurn).text;
            return (role === 'user' || role === 'assistant') && typeof text === 'string';
          })
          .map((turn) => ({ role: turn.role, text: String(turn.text).trim().slice(0, 1000) }))
          .filter((turn) => turn.text.length > 0)
          .slice(-10)
      : [];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, role: { select: { roleName: true } } },
    });
    const firstName = user?.firstName?.trim() || '';
    const roleName = user?.role?.roleName || ROLE_NAMES[roleId] || 'member';

    const llm = await askFreeLlm({ question, roleName, firstName, history });
    if (llm) {
      return { answer: llm.answer, provider: llm.provider as 'gemini' | 'groq' | 'openai' };
    }

    return { answer: composeGuideAnswer(question, firstName), provider: 'guide' };
  }
}

export class DiseaseDetectionService {
  /** Future: crop disease image classification */
  async analyzeImage(_imageUrl: string): Promise<{ disease: string | null; confidence: number }> {
    return { disease: null, confidence: 0 };
  }
}

export class PricePredictionService {
  /** Future: commodity price forecasting */
  async predict(_commodityId: number, _region: string): Promise<{ predictedPrice: number; trend: string }> {
    return { predictedPrice: 0, trend: 'stable' };
  }
}

export const matchingService = new MatchingService();
export const assistantService = new AssistantService();
export const diseaseDetectionService = new DiseaseDetectionService();
export const pricePredictionService = new PricePredictionService();
