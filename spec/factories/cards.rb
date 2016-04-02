FactoryGirl.define do
  factory :card do
    original_text "мяч"
    translated_text "ball"
    # image { fixture_file_upload(Rails.root.join('spec/files/goose.jpg'), 'image/jpg') }
    image Rack::Test::UploadedFile.new("#{Rails.root}/spec/files/goose.jpg", "image/jpg")
    association :user
  end
end
