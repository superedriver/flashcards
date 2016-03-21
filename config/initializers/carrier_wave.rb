require 'carrierwave/orm/activerecord'

CarrierWave.configure do |config|

  config.storage = ENV['FILES_STORAGE'].to_sym

  config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
      region: ENV['AWS_REGION']
  }
  config.cache_dir = "#{Rails.root}/tmp/uploads"
  config.fog_directory = ENV['AWS_BUCKET']
end