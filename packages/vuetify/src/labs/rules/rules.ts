import { useLocale } from '@/composables'
import { mergeDeep } from '@/util'
import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { ValidationRule } from '@/composables/validation'

export type ValidationRuleBuilderWithOptions<T> = (options: T, err?: string) => ValidationRule
export type ValidationRuleBuilder = (err?: string) => ValidationRule

export interface RulesInstance {
  required: ValidationRuleBuilder
  email: ValidationRuleBuilder
  number: ValidationRuleBuilder
  integer: ValidationRuleBuilder
  capital: ValidationRuleBuilder
  maxLength: ValidationRuleBuilderWithOptions<number>
  minLength: ValidationRuleBuilderWithOptions<number>
  strictLength: ValidationRuleBuilderWithOptions<number>
  exclude: ValidationRuleBuilderWithOptions<string[]>
  notEmpty: ValidationRuleBuilder
  pattern: ValidationRuleBuilderWithOptions<RegExp>
}

export type InternalRulesOptions = {
  // No options for now
}

export type RulesOptions = Partial<InternalRulesOptions>

const parseRulesOptions = (options?: RulesOptions) => {
  return mergeDeep({
  }, options)
}

export function createRules (options?: RulesOptions) {
  // @ts-ignore
  const _options = parseRulesOptions(options)

  const state: RulesInstance = {
    required: (err?: string) => {
      const { t } = useLocale()
      return (v: any) => !!v || t(err || '$vuetify.rules.required')
    },
    email: (err?: string) => {
      const { t } = useLocale()
      return (v: any) => (!v || (typeof v === 'string' && /^.+@\S+\.\S+$/.test(v))) || t(err || '$vuetify.rules.email')
    },
    number: (err?: string) => {
      const { t } = useLocale()
      return (v: string) => !!+v || t(err || '$vuetify.rules.number')
    },
    integer: (err?: string) => {
      const { t } = useLocale()
      return (v: string) => (/^[\d]*$/.test(v)) || t(err || '$vuetify.rules.integer')
    },
    capital: (err?: string) => {
      const { t } = useLocale()
      return (v: string) => (/^[A-Z]*$/.test(v)) || t(err || '$vuetify.rules.capital')
    },
    maxLength: (len: number, err?: string) => {
      const { t } = useLocale()
      return (v: any) => (!v || v.length <= len) || t(err || '$vuetify.rules.maxLength', [len])
    },
    minLength: (len: number, err?: string) => {
      const { t } = useLocale()
      return (v: any) => (!v || v.length >= len) || t(err || '$vuetify.rules.minLength', [len])
    },
    strictLength: (len: number, err?: string) => {
      const { t } = useLocale()
      return (v: any) => (!v || v.length === len) || t(err || '$vuetify.rules.strictLength', [len])
    },
    exclude: (forbiddenCharacters: string[], err?: string) => {
      return (v: string) => {
        const { t } = useLocale()
        let error: string | true = true
        for (const character of forbiddenCharacters) {
          if (v.includes(character)) error = err || t('$vuetify.rules.exclude', character)
        }
        return error
      }
    },
    notEmpty: (err?: string) => {
      const { t } = useLocale()
      return (v: any) => (v && v.length > 0) || t(err || '$vuetify.rules.notEmpty')
    },
    pattern: (pattern: RegExp, err?: string) => {
      const { t } = useLocale()
      return (v: any) => (!v || pattern.test(v) || t(err || '$vuetify.rules.pattern'))
    },
  }

  return state
}

export const RulesSymbol: InjectionKey<RulesInstance> = Symbol.for('vuetify:rules')

export function useRules () {
  const rules = inject(RulesSymbol)

  if (!rules) throw new Error('Could not find Vuetify rules injection')

  return rules
}
