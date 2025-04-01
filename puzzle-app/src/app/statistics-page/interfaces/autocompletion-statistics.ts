interface AutocompletedSentences {
  sentenceNumber: number
}

interface Rounds {
  [round: string]: Array<AutocompletedSentences>
}

export interface AutocompletionStatistics {
  [level: string]: Array<Rounds>
}
