require 'rails_helper'


RSpec.describe Deck, type: :model do

  before do
    @deck = create(:deck)
    @deck1 = create(:deck, name: "Deck1", current: nil, user_id: @deck.user_id)
    @deck2 = create(:deck, name: "Deck2", current: nil, user_id: @deck.user_id)
  end

  subject { @deck }

  it "#set_not_current!" do
    @deck.set_not_current!
    expect(@deck.reload.current).to be false
    expect(@deck1.reload.current).to be nil
    expect(@deck2.reload.current).to be nil
  end

  it "#set_current!" do
    @deck.set_current!
    expect(@deck.reload.current).to be true
    expect(@deck1.reload.current).to be false
    expect(@deck2.reload.current).to be false
  end
end
