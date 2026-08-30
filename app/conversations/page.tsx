import { ConversationList } from "@/components/features/conversation-list";
import { PageHeader } from "@/components/layout/page-header";
import { conversationPreviews } from "@/lib/data";

export const metadata = { title: "Conversations" };

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${conversationPreviews.length} sources`}
        title="Conversations"
        description="The discussions behind the items and decisions you saved."
      />
      <ConversationList conversations={conversationPreviews} />
    </div>
  );
}
