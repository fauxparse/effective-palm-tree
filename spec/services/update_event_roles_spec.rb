# frozen_string_literal: true

require 'rails_helper'

describe UpdateEventRoles, type: :service do
  subject(:service) { described_class.new(event, roles) }

  let(:event) { create(:event) }
  let(:mc) { create(:role, name: 'MC', group: event.group) }
  let(:player) { create(:role, name: 'player', group: event.group) }
  let(:muso) { create(:role, name: 'muso', group: event.group) }

  context 'for an event with no roles' do
    let(:roles) do
      [
        { role_id: mc.id, min: 1, max: 1 },
        { role_id: player.id, min: 1, max: 4 }
      ]
    end

    it 'adds the roles' do
      expect { service.call }.to change { event.allocations.count }.by(2)
    end

    it 'sorts the roles correctly' do
      service.call
      expect(event.allocations.sort_by(&:position).map(&:role))
        .to eq [mc, player]
    end
  end

  context 'for an event with existing roles' do
    before do
      event.allocations.create!(role: mc, min: 1, max: 1)
      event.allocations.create!(role: player, min: 1, max: 4)
    end

    let(:roles) do
      [
        { id: event.allocations.last.id, role_id: player.id, min: 0, max: 5 },
        { role_id: player.id, min: 0, max: 5 },
        { role_id: muso.id, min: 0, max: 1 }
      ]
    end

    it 'updates the allocations' do
      expect { service.call }.to change { event.allocations.count }.by(1)
    end

    it 'reuses the existing allocations' do
      player_allocation = event.allocations.detect { |a| a.role == player }
      service.call
      expect(event.allocations.map(&:id)).to include player_allocation.id
    end

    it 'adds the roles in the correct order' do
      service.call
      expect(event.allocations.sort_by(&:position).map(&:role))
        .to eq [player, player, muso]
    end
  end
end
