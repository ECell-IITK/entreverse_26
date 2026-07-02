import type { Competition, Member } from '@/lib/api'

export type FormState = {
  competitionId: number | null
  registrationCode: string
  teamName: string
  comments: string
  members: Member[]
}

export type CompetitionType = Competition
export type MemberType = Member
