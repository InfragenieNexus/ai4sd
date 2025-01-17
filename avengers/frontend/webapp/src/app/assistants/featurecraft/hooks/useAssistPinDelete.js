import axios from "axios";

export default async function deletePinnedMessage(conversationId, pinnedMessageId, setPinnedMessages, setError) {
    try {
        const response = await axios.delete('https://superhero-03-01-150699885662.europe-west1.run.app/chat/pin/delete', {
            data: {
                chatId: conversationId,
                pinnedMessageId: pinnedMessageId
            }
        });

        if (response.status === 200) {
            setPinnedMessages(prevMessages => prevMessages.filter(msg => msg.id !== pinnedMessageId));
        } else {
            setError('Failed to delete pinned message');
        }
    } catch (error) {
        setError(error.response?.data?.detail || 'An error occurred');
    }
}