FactoryGirl.define do
  factory :deck do
    name "MyString"
    current nil
    association :user
  end
end
