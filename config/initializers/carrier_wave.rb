require 'carrierwave/orm/activerecord'

CarrierWave.configure do |config|

  if ENV['AWS_ACCESS_KEY_ID'].present?
    config.storage = :fog

    config.fog_credentials = {
        provider: 'AWS',
        aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
        region: ENV['AWS_REGION']
    }
    config.cache_dir = "#{Rails.root}/tmp/uploads"
    config.fog_directory = ENV['AWS_BUCKET']
  else
    config.storage = :file
  end
end

if Rails.env.test? or Rails.env.cucumber?
  CarrierWave.configure do |config|
    config.storage = :file
    config.enable_processing = false
  end
end