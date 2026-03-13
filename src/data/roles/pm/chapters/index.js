import { chapter1 } from './chapter1.js'
import { chapter2 } from './chapter2.js'
import { chapter3 } from './chapter3.js'
import { chapter4 } from './chapter4.js'
import { chapter5 } from './chapter5.js'
import { chapter6 } from './chapter6.js'
import { chapter7 } from './chapter7.js'
import { chapter8 } from './chapter8.js'
import { CHAPTER_META, PART_META } from '../courseMeta.js'

export const chapters = {
  1: chapter1,
  2: chapter2,
  3: chapter3,
  4: chapter4,
  5: chapter5,
  6: chapter6,
  7: chapter7,
  8: chapter8,
}

export { CHAPTER_META, PART_META }

export function getChapter(chapterId) {
  return chapters[chapterId] || null
}

export function getMaxChapter() {
  return CHAPTER_META.length
}
