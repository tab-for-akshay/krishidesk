import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Button, Heading, Inline, Lozenge, Spinner, Stack, Text, Link, SectionMessage } from '@forge/react';
import { invoke } from '@forge/bridge';

const tone = { critical: 'removed', high: 'moved', medium: 'inprogress', low: 'default' };

function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [applied, setApplied] = useState(null);
  useEffect(() => { invoke('triage').then(setData).catch(e => setErr(String(e))); }, []);
  if (err) return <SectionMessage appearance="error"><Text>{err}</Text></SectionMessage>;
  if (!data) return <Spinner label="Triaging" />;
  const t = data.triage;
  return (
    <Stack space="space.150">
      <Inline space="space.100">
        <Lozenge appearance={tone[t.urgency]}>{t.urgency}</Lozenge>
        <Lozenge>{t.category}</Lozenge>
        <Lozenge appearance="new">{t.requestType}</Lozenge>
        {t.crop ? <Lozenge appearance="success">{t.crop}</Lozenge> : null}
      </Inline>
      {t.safety ? <SectionMessage appearance="error" title="Possible pesticide poisoning"><Text>Emergency queue, 15-minute callback. Send first aid only: {t.safetyReasons.join('; ')}</Text></SectionMessage> : null}
      {t.safetyLevel === 'chemical' ? <SectionMessage appearance="warning" title="Chemical question"><Text>No product or dose is drafted. An expert must reply: {t.safetyReasons.join('; ')}</Text></SectionMessage> : null}
      <Text>Queue: {data.queue}</Text>
      <Heading as="h4">Vetted advice</Heading>
      {data.matches.length ? data.matches.map(m => (
        <Box key={m.id}>
          <Text weight="bold">{m.title}{m.expertReview ? ' (expert sign-off needed)' : ''}</Text>
          <Text>{m.advice}</Text>
          <Link href={m.source}>Source</Link>
        </Box>
      )) : <Text>No vetted advisory matches. Route to the subject-matter expert.</Text>}
      <Heading as="h4">Draft reply</Heading>
      <Text>{data.reply}</Text>
      <Inline space="space.100" alignBlock="center">
        <Button onClick={() => invoke('applyLabels').then(setApplied).catch(e => setErr(String(e)))}>Apply labels</Button>
        <Text size="small">{applied ? 'Added: ' + applied.added.join(', ') : 'Suggested labels: ' + t.labels.join(', ')}</Text>
      </Inline>
    </Stack>
  );
}
ForgeReconciler.render(<React.StrictMode><App /></React.StrictMode>);
