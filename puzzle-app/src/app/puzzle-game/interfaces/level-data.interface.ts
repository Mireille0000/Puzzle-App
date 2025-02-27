interface LevelData {
  author: string,
  cutSrc: string
  id: string
  imageSrc: string
  name: string
  year: string
}

interface Card {
  audioExample: string
  id: number,
  textExample: string
  textExampleTranslate: string
  word: string
  wordTranslate: string
}

interface Round {
  levelData: Array<LevelData>,
  words: Array<Card>
}

interface Level {
  rounds: Array<Round>,
  roundsCount: number
}

export default Level;
