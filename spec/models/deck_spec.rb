require "rails_helper"

RSpec.describe Deck, type: :model do
  before do
    @deck = create(:deck)
    @deck1 = create(:deck, name: "Deck1", current: nil, user_id: @deck.user_id)
    @deck2 = create(:deck, name: "Deck2", current: nil, user_id: @deck.user_id)
  end

  subject { @deck }

  it { should respond_to(:name) }
  it { should respond_to(:created_at) }
  it { should respond_to(:updated_at) }
  it { should respond_to(:user_id) }
  it { should respond_to(:cards) }
  it { should respond_to(:set_not_current!) }
  it { should respond_to(:set_current!) }
  it { should respond_to(:user) }

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

  describe "check_validation" do
    it "name is empty" do
      @deck = build(:deck, name: "")
      @deck.valid?
      expect(@deck.errors.messages[:name][0]).to eq(I18n.t("activerecord.errors.models.deck.attributes.name.blank"))
    end
  end
end
