defmodule MyChatBackend.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MyChatBackendWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:my_chat_backend, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: MyChatBackend.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: MyChatBackend.Finch},
      # Start a worker by calling: MyChatBackend.Worker.start_link(arg)
      # {MyChatBackend.Worker, arg},
      # Start to serve requests, typically the last entry
      MyChatBackendWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MyChatBackend.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MyChatBackendWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
