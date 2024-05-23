
type Status = 'taken' | 'available' | 'suspended' | 'special_charac_not_allowed' | 'upper_case_letters_not_allowed' | 'too_little_characters' | 'too_many_characters' | 'must_contain_letter' | 'is_inappropriate'

interface Platform {
    id: number;
    name: string;
    icon: string;
    url: string;
    status: Status | null | 'fetching';
}
