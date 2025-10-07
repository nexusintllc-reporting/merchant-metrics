import { Page, Card } from "@shopify/polaris";
import EmailSettings from '../components/EmailSettings';

export default function EmailSettingsPage() {
  return (
    <Page title="Email Settings">
      <Card>
        <EmailSettings />
      </Card>
    </Page>
  );
}