
export type UsernameStatus = 'taken' | 'available' | 'suspended' | 'special_charac_not_allowed' | 'upper_case_letters_not_allowed' | 'too_little_characters' | 'too_many_characters' | 'must_contain_letter' | 'is_inappropriate'

export interface PlatformResponse {
    status: UsernameStatus | null,
    error: string | null
}
