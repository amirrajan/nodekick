def run
  system("cls")
  system("jasmine-node ./specifications")
  # system("jasmine-node --growl ./specifications") # optional
end

watch ('.*.js$') { run }
