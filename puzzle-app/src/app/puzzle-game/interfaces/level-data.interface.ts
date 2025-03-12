interface LevelData {
  author: string,
  cutSrc: string
  id: string
  imageSrc: string
  name: string
  year: string
}

export interface Card {
  audioExample: string
  id: number,
  textExample: string
  textExampleTranslate: string
  word: string
  wordTranslate: string
}

interface Round {
  levelData: LevelData,
  words: Array<Card>
}

export interface Level {
  rounds: Array<Round>,
  roundsCount: number
}

// export {Level, Card};
