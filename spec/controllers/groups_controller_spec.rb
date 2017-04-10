# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GroupsController, type: :request do
  subject { response }

  let(:group) { create(:group) }
  let(:member) { create(:member, :verified, group: group) }
  let(:user_id) { member.user.try(:to_param) }

  describe 'GET #index' do
    context 'as JSON' do
      before do
        get groups_path, params: { format: :json, as: user_id }
      end

      it { is_expected.to be_success }

      describe 'response' do
        subject { json }

        it { is_expected.to have_exactly(1).item }

        it { is_expected.to match [a_hash_including(name: member.name)] }
      end
    end
  end

  describe 'GET #show' do
    context 'as JSON' do
      before do
        get group_path(group), params: { format: :json, as: user_id }
      end

      it { is_expected.to be_success }

      describe 'response' do
        subject { json }

        let(:shape) do
          a_hash_including(
            name: member.name,
            group: a_hash_including(
              name: group.name,
              members: [a_hash_including(name: member.name)]
            )
          )
        end

        it { is_expected.to match shape }
      end
    end
  end
end
