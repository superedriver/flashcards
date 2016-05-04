FactoryGirl.define do
  factory :deck do
    name "MyDeck"
    current nil
    association :user
  end
end
