FactoryGirl.define do
  factory :card do
    original_text "мяч"
    translated_text "ball"
    image Rack::Test::UploadedFile.new("#{Rails.root}/spec/files/goose.jpg", "image/jpg")
    association :deck
  end
end
