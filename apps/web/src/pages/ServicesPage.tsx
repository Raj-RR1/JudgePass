import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiClient } from "../lib/apiClient";

interface Service {
  model: string;
  provider: string;
  endpoint?: string;
  verified?: boolean;
  status?: string;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await apiClient.listServices();
      setServices(data.services || []);
    } catch (error) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Available LLM Services
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Verifiable AI providers that can be used for judging submissions
        </p>
      </header>

      {services.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Services Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No LLM services are currently registered on the network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {service.model || "Unknown Model"}
                </h3>
                {service.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Provider:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs">
                    {service.provider?.slice(0, 10)}...
                    {service.provider?.slice(-8)}
                  </span>
                </div>

                {service.endpoint && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Endpoint:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {service.endpoint}
                    </span>
                  </div>
                )}

                {service.status && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`ml-2 font-medium ${
                        service.status === "online"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          About LLM Services
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          These are decentralized AI providers that can perform judging tasks.
          Each service provides verifiable computation results that can be
          validated on-chain.
        </p>
      </div>
    </div>
  );
}
