# CarrierWave.configure do |config|
#   # config.fog_provider = 'aws'
#   config.fog_provider = 'fog/aws'
#   # config.fog_provider = 'fog'
#   config.fog_credentials = {
#       :provider               => 'AWS',
#       :aws_access_key_id      => ENV['AWS_ACCESS_KEY_ID'],
#       :aws_secret_access_key  => ENV['AWS_SECRET_ACCESS_KEY'],
#       :region                 => ENV['AWS_REGION'] # Change this for different AWS region. Default is 'us-east-1'
#   }
#   config.fog_directory  = ENV['AWS_BUCKET']
# end

# DOCUMENTATION
CarrierWave.configure do |config|
  config.fog_provider = 'fog/aws'                        # required
  config.fog_credentials = {
      provider:              'AWS',                        # required
      aws_access_key_id:     ENV['AWS_ACCESS_KEY_ID'],                        # required
      aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],                        # required
      region:                ENV['AWS_REGION'],                  # optional, defaults to 'us-east-1'
      # host:                  's3.example.com',             # optional, defaults to nil
      # endpoint:              'https://s3.example.com:8080' # optional, defaults to nil
  }
  config.fog_directory  = ENV['AWS_BUCKET']                          # required
  config.fog_public     = false                                        # optional, defaults to true
  # config.fog_attributes = { 'Cache-Control' => "max-age=#{365.day.to_i}" } # optional, defaults to {}
end


# FROM MAKS
# CarrierWave.configure do |config|
#   config.fog_credentials = {
#       :provider               => 'AWS',                        # required
#       :aws_access_key_id      => ENV['AWS_ACCESS_KEY_ID'],                        # required
#       :aws_secret_access_key  => ENV['AWS_SECRET_ACCESS_KEY'],                        # required
#       :path_style => true,
#       :region                 => ENV['AWS_REGION'],                  # optional, defaults to 'us-east-1'
#       #:host                   => 's3.example.com',             # optional, defaults to nil
#       # :endpoint               => 'https://s3-eu-west-2.amazonaws.com' # optional, defaults to nil
#   }
#   config.fog_directory  = ENV['AWS_BUCKET']                          # required
#   config.fog_public     = true                                       # optional, defaults to true
#   config.fog_attributes = {'Cache-Control'=>"max-age=#{365.day.to_i}"} # optional, defaults to {}
# end


