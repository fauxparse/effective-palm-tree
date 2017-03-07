module Requests
  module JsonHelpers
    def json
      deeply_indifferent(JSON.parse(response.body))
    end

    private

    def deeply_indifferent(data)
      case data
      when Array then data.map { |child| deeply_indifferent(child) }
      else data.with_indifferent_access
      end
    end
  end
end
