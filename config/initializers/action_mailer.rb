Rails.application.configure do
  # MAIL
  # to use Letter Opener
  # config.action_mailer.delivery_method = :letter_opener

  # # to use GMAIL comment above line and uncomment
  # config.action_mailer.delivery_method = :smtp
  # # SMTP settings for gmail
  # config.action_mailer.smtp_settings = {
  #    address:              'smtp.gmail.com',
  #    port:                 587,
  #    user_name:            ENV['GMAIL_USERNAME'],
  #    password:             ENV['GMAIL_PASSWORD'],
  #    authentication:       'plain',
  #    enable_starttls_auto: true
  # }

  # Mailgun
  if Rails.env.development? || Rails.env.production?
    config.action_mailer.smtp_settings = {
        port:            ENV['MAILGUN_PORT'],
        address:         ENV['MAILGUN_ADDRESS'],
        user_name:       ENV['MAILGUN_USERNAME'],
        password:        ENV['MAILGUN_PASSWORD'],
        domain:          ENV['MAILGUN_DOMAIN'],
        authentication:  ENV['MAILGUN_AUTHENTICATION'],
    }
    config.action_mailer.delivery_method = :smtp
  end
end
