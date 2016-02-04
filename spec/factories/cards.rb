FactoryGirl.define do
  factory :card do
    original_text "мяч"
    translated_text "ball"
    association :user
  end
end
