defmodule MyChatBackendWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel("room:*", MyChatBackendWeb.RoomChannel)

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
