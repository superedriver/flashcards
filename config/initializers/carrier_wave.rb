require 'carrierwave/orm/activerecord'

CarrierWave.configure do |config|

  if ENV['AWS_ACCESS_KEY_ID'].present? && !Rails.env.test?
    config.storage = :fog

    config.fog_credentials = {
        provider: 'AWS',
        aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
        region: ENV['AWS_REGION']
    }
    config.cache_dir = "#{Rails.root}/tmp/uploads"
    config.fog_directory = ENV['AWS_BUCKET']
  elsif ENV['AWS_ACCESS_KEY_ID'] && Rails.env.development?
    config.storage = :file
    config.enable_processing = true
  else
    config.storage = :file
    config.enable_processing = false
  end
end
