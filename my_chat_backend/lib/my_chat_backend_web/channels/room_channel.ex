defmodule MyChatBackendWeb.RoomChannel do
  # チャンネルを定義(channelを定義)
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    # チャンネルに参加したら、socketを返す
    {:ok, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{body: body})
    {:noreply, socket}
  end
end
