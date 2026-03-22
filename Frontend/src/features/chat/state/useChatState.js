import { useSelector } from "react-redux";

export default function useChatState() {
  return useSelector((state) => state.chat);
}
