---
sidebar_position: 1
---

# Events

### QBCore:Server:TriggerCallback
Event for triggering a callback
```lua
RegisterNetEvent('QBCore:Server:TriggerCallback', function(name, ...)
	local src = source
	QBCore.Functions.TriggerCallback(name, src, function(...)
		TriggerClientEvent('QBCore:Client:TriggerCallback', src, name, ...)
	end, ...)
end)
```

### QBCore:UpdatePlayer
Event for updating and saving player data
```lua
RegisterNetEvent('QBCore:UpdatePlayer', function()
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	if Player then
		local newHunger = Player.PlayerData.metadata['hunger'] - QBCore.Config.Player.HungerRate
		local newThirst = Player.PlayerData.metadata['thirst'] - QBCore.Config.Player.ThirstRate
		if newHunger <= 0 then newHunger = 0 end
		if newThirst <= 0 then newThirst = 0 end
		Player.Functions.SetMetaData('thirst', newThirst)
		Player.Functions.SetMetaData('hunger', newHunger)
		TriggerClientEvent('hud:client:UpdateNeeds', src, newHunger, newThirst)
		Player.Functions.Save()
	end
end)
```

### QBCore:Server:SetMetaData
Event to set a players metadata
```lua
RegisterNetEvent('QBCore:Server:SetMetaData', function(meta, data)
    local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	if meta == 'hunger' or meta == 'thirst' then
		if data > 100 then
			data = 100
		end
	end
	if Player then
		Player.Functions.SetMetaData(meta, data)
	end
	TriggerClientEvent('hud:client:UpdateNeeds', src, Player.PlayerData.metadata['hunger'], Player.PlayerData.metadata['thirst'])
end)
```

### QBCore:ToggleDuty
Event to toggle a players duty status
```lua
RegisterNetEvent('QBCore:ToggleDuty', function()
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	if Player.PlayerData.job.onduty then
		Player.Functions.SetJobDuty(false)
		TriggerClientEvent('QBCore:Notify', src, 'You are now off duty!')
	else
		Player.Functions.SetJobDuty(true)
		TriggerClientEvent('QBCore:Notify', src, 'You are now on duty!')
	end
	TriggerClientEvent('QBCore:Client:SetDuty', src, Player.PlayerData.job.onduty)
end)
```

### QBCore:Server:UseItem
Event to call for item use (not recommended)
```lua
RegisterNetEvent('QBCore:Server:UseItem', function(item)
	local src = source
	if item and item.amount > 0 then
		if QBCore.Functions.CanUseItem(item.name) then
			QBCore.Functions.UseItem(src, item)
		end
	end
end)
```

### QBCore:Server:RemoveItem
Event to call removing an item from a player (not recommended)
```lua
RegisterNetEvent('QBCore:Server:RemoveItem', function(itemName, amount, slot)
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	Player.Functions.RemoveItem(itemName, amount, slot)
end)
```

### QBCore:Server:AddItem
Event to call for giving a player an item (not recommended)
```lua
RegisterNetEvent('QBCore:Server:AddItem', function(itemName, amount, slot, info)
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	Player.Functions.AddItem(itemName, amount, slot, info)
end)
```

### QBCore:CallCommand
Event to trigger a command outside the chat (ex: qb-adminmenu)
```lua
RegisterNetEvent('QBCore:CallCommand', function(command, args)
	local src = source
	if QBCore.Commands.List[command] then
		local Player = QBCore.Functions.GetPlayer(src)
		if Player then
			local isGod = QBCore.Functions.HasPermission(src, 'god')
            local hasPerm = QBCore.Functions.HasPermission(src, QBCore.Commands.List[command].permission)
            local isPrincipal = IsPlayerAceAllowed(src, 'command')
			if (QBCore.Commands.List[command].permission == Player.PlayerData.job.name) or isGod or hasPerm or isPrincipal then
				if (QBCore.Commands.List[command].argsrequired and #QBCore.Commands.List[command].arguments ~= 0 and args[#QBCore.Commands.List[command].arguments] == nil) then
					TriggerClientEvent('QBCore:Notify', src, 'All arguments must be filled out!', 'error')
				else
					QBCore.Commands.List[command].callback(src, args)
				end
			else
				TriggerClientEvent('QBCore:Notify', src, 'No Access To This Command', 'error')
			end
		end
	end
end)
```