# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Occurrence, type: :model do
  subject(:occurrence) { event.occurrences.at(event.schedule.first) }
  let(:event) { create(:event) }

  describe '#to_param' do
    subject(:param) { occurrence.to_param }

    it { is_expected.to eq '2017-03-10' }
  end
end
