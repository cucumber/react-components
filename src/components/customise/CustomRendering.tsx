import type {
  Attachment,
  Background,
  DataTable,
  DocString,
  Examples,
  Feature,
  GherkinDocument,
  PickleDocString,
  PickleTable,
  PickleTag,
  Rule,
  Scenario,
  Tag,
  TestStepResultStatus,
} from '@cucumber/messages'
import React, {
  type FC,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from 'react'

function mixinStyles<Classes>(
  builtIn: Record<string, string>,
  custom?: Record<string, string> | React.FunctionComponent
): Classes {
  const mixed: Record<string, unknown> = {}
  for (const key of Object.keys(builtIn)) {
    if (builtIn[key]) {
      mixed[key] = builtIn[key]
    }
    if (custom && typeof custom !== 'function' && custom[key]) {
      mixed[key] = custom[key]
    }
  }
  return mixed as Classes
}

type Styles<C extends string> = Record<C, string>

export interface AnchorProps {
  id: string
  children: ReactNode
}

export type AnchorClasses = Styles<'wrapper' | 'anchor'>

export interface AttachmentProps {
  attachment: Attachment
}

export type AttachmentClasses = Styles<'text' | 'log' | 'icon' | 'image' | 'links'>

export interface BackgroundProps {
  background: Background
}

export interface ChildrenProps {
  children: ReactNode
}

export type ChildrenClasses = Styles<'children'>

export interface DataTableProps {
  dataTable: DataTable | PickleTable
}

export type DataTableClasses = Styles<'table'>

export interface DescriptionProps {
  description?: string
}

export type DescriptionClasses = Styles<'content'>

export interface DocStringProps {
  docString: DocString | PickleDocString
}

export type DocStringClasses = Styles<'docString'>

export interface ErrorMessageProps {
  message?: string
  children?: ReactNode
}

export type ErrorMessageClasses = Styles<'message'>

export interface ExamplesProps {
  examples: Examples
}

export interface FeatureProps {
  feature: Feature
}

export interface GherkinDocumentProps {
  gherkinDocument: GherkinDocument
}

export type Header = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export interface KeywordProps {
  children: ReactNode
}

export type KeywordClasses = Styles<'keyword'>

export interface ParameterProps {
  parameterTypeName: string
  value: string
  children: ReactNode
}

export type ParameterClasses = Styles<'parameter'>

export interface StatusIconProps {
  status: TestStepResultStatus
}

export interface RuleProps {
  rule: Rule
}

export interface ScenarioProps {
  scenario: Scenario
}

export type StatusIconClasses = Styles<'icon'>

export interface TagsProps {
  tags: readonly Tag[] | readonly PickleTag[]
}

export type TagsClasses = Styles<'tags' | 'tag'>

export interface TitleProps {
  header: Header
  id: string
  children: ReactNode
}

export type TitleClasses = Styles<'title'>

export declare type DefaultComponent<
  Props,
  Classes extends Styles<string> = Record<string, string>,
> = FunctionComponent<Props & { styles: Classes }>

export declare type CustomisedComponent<
  Props,
  Classes = Record<string, string>,
> = React.FunctionComponent<
  Props & {
    styles: Classes
    DefaultRenderer: React.FunctionComponent<Props>
  }
>

export declare type Customised<Props, Classes = Record<string, string>> =
  | CustomisedComponent<Props, Classes>
  | Partial<Classes>

export interface CustomRenderingSupport {
  Anchor?: Customised<AnchorProps, AnchorClasses>
  Attachment?: Customised<AttachmentProps, AttachmentClasses>
  Background?: Customised<BackgroundProps>
  Children?: Customised<ChildrenProps, ChildrenClasses>
  DataTable?: Customised<DataTableProps, DataTableClasses>
  Description?: Customised<DescriptionProps, DescriptionClasses>
  DocString?: Customised<DocStringProps, DocStringClasses>
  ErrorMessage?: Customised<ErrorMessageProps, ErrorMessageClasses>
  Examples?: Customised<ExamplesProps>
  Feature?: Customised<FeatureProps>
  GherkinDocument?: Customised<GherkinDocumentProps>
  Keyword?: Customised<KeywordProps, KeywordClasses>
  Parameter?: Customised<ParameterProps, ParameterClasses>
  Rule?: Customised<RuleProps>
  Scenario?: Customised<ScenarioProps>
  StatusIcon?: Customised<StatusIconProps, StatusIconClasses>
  Tags?: Customised<TagsProps, TagsClasses>
  Title?: Customised<TitleProps, TitleClasses>
}

export declare type CustomRenderable = keyof CustomRenderingSupport

export const CustomRenderingContext = React.createContext<CustomRenderingSupport>({})

export function useCustomRendering<Props, Classes extends Styles<string> = Record<string, string>>(
  component: CustomRenderable,
  defaultStyles: Record<string, string>,
  DefaultRenderer: DefaultComponent<Props, Classes>
): FunctionComponent<Props> {
  const { [component]: Custom } = useContext(CustomRenderingContext)
  // @ts-expect-error
  const composedStyles = mixinStyles<Classes>(defaultStyles, Custom)
  const StyledDefaultRenderer: React.FunctionComponent<Props> = (props) => {
    return <DefaultRenderer {...props} styles={composedStyles} />
  }
  if (typeof Custom === 'function') {
    const StyledCustomRenderer: React.FunctionComponent<Props> = (props) => {
      // @ts-expect-error
      return <Custom {...props} styles={composedStyles} DefaultRenderer={StyledDefaultRenderer} />
    }
    return StyledCustomRenderer
  }
  return StyledDefaultRenderer
}

export const CustomRendering: FC<PropsWithChildren<{ overrides: CustomRenderingSupport }>> = ({
  overrides,
  children,
}) => {
  return (
    <CustomRenderingContext.Provider value={overrides}>{children}</CustomRenderingContext.Provider>
  )
}
