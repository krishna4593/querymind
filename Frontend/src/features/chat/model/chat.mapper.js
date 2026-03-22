export function mapChatFromApi(chat) {
  return {
    id: chat._id,
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

export function mapMessageFromApi(message) {
  return {
    id: message._id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  };
}
