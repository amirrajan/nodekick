def run
  system("cls")
  system("jasmine-node ./specifications")
end

watch ('.*.js$') { run }
