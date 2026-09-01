import { ConversationList } from "@/components/features/conversation-list";
import { PageHeader } from "@/components/layout/page-header";
import { conversationPreviews } from "@/lib/data";

export const metadata = { title: "History" };

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${conversationPreviews.length} sources`}
        title="History"
        description="Search the conversations behind your saved items and decisions."
      />
      <ConversationList conversations={conversationPreviews} />
    </div>
  );
}
