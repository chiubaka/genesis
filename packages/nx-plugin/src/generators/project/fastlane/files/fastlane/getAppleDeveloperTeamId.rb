require "spaceship"

Spaceship.login
team_id = CredentialsManager::AppfileConfig.try_fetch_value(:team_id)
if team_id == nil
  team_id = Spaceship::Portal.client.team_id
  puts "Saving team_id #{team_id} to Appfile"
  open("#{__dir__}/Appfile", "a") do |f|
    f.puts "team_id(\"#{team_id}\") # Developer Portal Team ID"
  end
else
  puts "team_id is already present in Appfile"
end
