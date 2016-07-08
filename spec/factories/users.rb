FactoryGirl.define do
  factory :user do
    sequence(:email) { |i| "email#{i}@gmail.com" }
    password "qwerty"
    password_confirmation "qwerty"
    locale "en"
  end
end
