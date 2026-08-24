/**
 * 知识搜索：构建期把内容聚合为 section 文档，MiniSearch 直接负责评分与排序。
 * 运行时只保留同义词扩展、摘要定位和 SearchResult 结构转换。
 */
import type { SearchResult as MiniSearchResult } from "minisearch";
import type {
  KnowledgeMatchField,
  SearchKnowledgeSectionDoc,
  SearchKnowledgeSectionPart,
  SearchResult,
} from "@/search/types";
import type { LoadedCorpus } from "@/search/shared";
import { extractSnippet, normalizeIo } from "@/search/shared";

function asciiWordMatch(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(text);
}

/** 保留既有同义词召回；它只扩充查询，不参与计算相关性分数。 */
export function expandWithSynonyms(
  rawQuery: string,
  synonyms: Map<string, string[]>,
): string {
  const text = String(rawQuery);
  const expanded = new Set<string>();
  text
    .replace(/[\p{P}]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((token) => expanded.add(token));

  const normalized = normalizeIo(text).toLowerCase();
  for (const [word, group] of synonyms) {
    if (!word) continue;
    const matched = /[\u3400-\u9fff]/.test(word)
      ? normalized.includes(word)
      : asciiWordMatch(normalized, word);
    if (matched) group.forEach((variant) => expanded.add(variant));
  }
  return Array.from(expanded).join(" ");
}

type KnowledgeHit = MiniSearchResult & SearchKnowledgeSectionDoc;

type SnippetSource = {
  text: string;
  blockId?: string;
  part?: SearchKnowledgeSectionPart;
};

function includesAny(text: string, needles: string[]): boolean {
  const normalized = normalizeIo(text).toLowerCase();
  return needles.some((needle) => normalized.includes(needle));
}

function locateSnippet(hit: KnowledgeHit, query: string): SnippetSource {
  const matchedFields = new Set(Object.values(hit.match || {}).flat());
  const needles = [query, ...hit.terms]
    .map((term) => normalizeIo(term).toLowerCase().trim())
    .filter(Boolean);

  if (matchedFields.has("sectionTitle")) return { text: hit.sectionTitle };

  if (matchedFields.has("pointTitles")) {
    const part = hit.parts.find((item) =>
      includesAny(item.pointTitle, needles),
    );
    if (part) return { text: part.pointTitle, blockId: part.blockId, part };
  }

  if (matchedFields.has("subpointTitles")) {
    const part = hit.parts.find((item) =>
      includesAny(item.subpointTitle, needles),
    );
    if (part) return { text: part.subpointTitle, blockId: part.blockId, part };
  }

  for (const part of hit.parts) {
    const blockIndex = part.blockTexts.findIndex((text) =>
      includesAny(text, needles),
    );
    if (blockIndex >= 0) {
      return {
        text: part.blockTexts[blockIndex],
        blockId: part.blockIds[blockIndex] || part.blockId,
        part,
      };
    }
  }

  const fallbackPart = hit.parts[0];
  return {
    text:
      fallbackPart?.blockTexts[0] ||
      fallbackPart?.subpointTitle ||
      hit.sectionTitle,
    blockId: fallbackPart?.blockIds[0] || fallbackPart?.blockId,
    part: fallbackPart,
  };
}

export function searchKnowledge(
  query: string,
  loaded: LoadedCorpus,
  topK: number,
): SearchResult[] {
  const expandedQuery = expandWithSynonyms(query, loaded.synonyms);
  const hits = loaded.miniSearch.search(expandedQuery, {
    combineWith: "OR",
    boost: {
      sectionTitle: 3,
      pointTitles: 2.5,
      subpointTitles: 2,
      body: 1,
    },
  }) as KnowledgeHit[];

  return hits.slice(0, topK).map((hit) => {
    const snippet = locateSnippet(hit, query);
    return {
      type: "knowledge" as const,
      title: hit.sectionTitle,
      subtitle: [hit.bookTitle, hit.chapterTitle, hit.sectionTitle]
        .filter(Boolean)
        .join(" › "),
      snippet: extractSnippet(snippet.text, query),
      route: hit.route,
      blockId: snippet.blockId,
      blockIds: hit.allBlockIds,
      examCount: hit.examCount,
      matchField: "section" as KnowledgeMatchField,
      sectionId: hit.sectionId,
      subpointId: snippet.part?.subpointId,
      matchedBlockId: snippet.blockId,
      bookTitle: hit.bookTitle,
      chapterTitle: hit.chapterTitle,
      sectionTitle: hit.sectionTitle,
      pointTitle: snippet.part?.pointTitle,
      subpointTitle: snippet.part?.subpointTitle,
      score: hit.score,
      highlightQuery: expandedQuery,
    };
  });
}
