# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  subject { response }

  let(:user) { nil }
  let(:current_user) { request.env[:clearance].current_user }

  describe 'GET #show' do
    before do
      get session_path, params: { format: :json, as: user.try(:to_param) }
    end

    it { is_expected.to have_http_status :unauthorized }

    context 'when logged in' do
      let(:user) { create(:user) }

      it { is_expected.to have_http_status :success }

      describe 'response' do
        subject { json }

        it { is_expected.to include email: user.email }
      end
    end
  end

  describe 'POST #create' do
    let(:user) { create(:user) }

    context 'as HTML' do
      before do
        post session_path, params: { format: :html, session: session_params }
      end

      context 'with a good password' do
        let(:session_params) { { email: user.email, password: user.password } }

        it { is_expected.to redirect_to root_path }
      end

      context 'with a bad password' do
        let(:session_params) { { email: user.email, password: 'bad' } }

        it { is_expected.to have_http_status :unauthorized }
      end
    end

    context 'as JSON' do
      before do
        post session_path, params: { format: :json, session: session_params }
      end

      context 'with a good password' do
        let(:session_params) { { email: user.email, password: user.password } }

        it { is_expected.to have_http_status :success }

        it 'logs the user in' do
          expect(current_user).to eq user
        end

        describe 'response' do
          subject { json }

          it { is_expected.to include email: user.email }
        end
      end

      context 'with a bad password' do
        let(:session_params) { { email: user.email, password: 'bad' } }

        it { is_expected.to have_http_status :unauthorized }

        it 'does not log the user in' do
          expect(current_user).to be_nil
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    let(:user) { create(:user) }

    describe 'as HTML' do
      before { delete session_path, params: { as: user.try(:id) } }
      it { is_expected.to redirect_to root_path }

      it 'logs the user out' do
        expect(current_user).to be_nil
      end
    end
  end
end
