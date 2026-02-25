import React from 'react';
import DocItem from '@theme-original/DocItem';
import type DocItemType from '@theme/DocItem';
import type { WrapperProps } from '@docusaurus/types';
import PersonalizationBar from '../../components/PersonalizationBar';
import TranslationWrapper from '../../components/TranslationWrapper';

type Props = WrapperProps<typeof DocItemType>;

export default function DocItemWrapper(props: Props): JSX.Element {
  // Extract chapter ID from doc metadata
  const chapterId: string = (props.content as any)?.metadata?.id ?? 'unknown';

  return (
    <TranslationWrapper chapterId={chapterId}>
      <PersonalizationBar chapterId={chapterId} />
      <DocItem {...props} />
    </TranslationWrapper>
  );
}
