require 'securerandom'

# FactoryGirl.define do
#   factory :user do
#     # todo sequence doesn't work
#     # sequence(:email) { |i| "email#{i}@gmail.com" }
#     # sequence :email do |n|
#     #   "person122#{n}@example.com"
#     # end
#     email "person122#{SecureRandom.hex(15)}@example.com"
#     password "qwerty"
#   end
# end


FactoryGirl.define do
  factory :user do
    sequence(:email) { |i| "email#{i}@gmail.com" }
    password 'qwerty'
    password_confirmation 'qwerty'
  end
end
