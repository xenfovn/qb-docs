---
sidebar_position: 2
---

# Functions

### QBCore.Functions.GetCoords
Get the coords of a passed entity
```lua
function QBCore.Functions.GetCoords(entity)
    local coords = GetEntityCoords(entity, false)
    local heading = GetEntityHeading(entity)
	return vector4(coords.x, coords.y, coords.z, heading)
end
```

### QBCore.Functions.GetIdentifier
Get a specific identifier of a player
```lua
function QBCore.Functions.GetIdentifier(source, idtype)
	local src = source
	local idtype = idtype or QBConfig.IdentifierType
	for _, identifier in pairs(GetPlayerIdentifiers(src)) do
		if string.find(identifier, idtype) then
			return identifier
		end
	end
	return nil
end
```

### QBCore.Functions.GetSource
Get a players source by identifer
```lua
function QBCore.Functions.GetSource(identifier)
	for src, player in pairs(QBCore.Players) do
		local idens = GetPlayerIdentifiers(src)
		for _, id in pairs(idens) do
			if identifier == id then
				return src
			end
		end
	end
	return 0
end
```

### QBCore.Functions.GetPlayer
Get a player by their source and access their data
```lua
function QBCore.Functions.GetPlayer(source)
    local src = source
	if type(src) == 'number' then
		return QBCore.Players[src]
	else
		return QBCore.Players[QBCore.Functions.GetSource(src)]
	end
end
```

### QBCore.Functions.GetPlayerByCitizenId
Get a player by their citizen id and access their data (must be online)
```lua
function QBCore.Functions.GetPlayerByCitizenId(citizenid)
	for src, player in pairs(QBCore.Players) do
		local cid = citizenid
		if QBCore.Players[src].PlayerData.citizenid == cid then
			return QBCore.Players[src]
		end
	end
	return nil
end
```

### QBCore.Functions.GetPlayerByPhone
Get a player by their phone number (must be online)
```lua
function QBCore.Functions.GetPlayerByPhone(number)
	for src, player in pairs(QBCore.Players) do
		local cid = citizenid
		if QBCore.Players[src].PlayerData.charinfo.phone == number then
			return QBCore.Players[src]
		end
	end
	return nil
end
```

### QBCore.Functions.GetPlayers
Get all player IDs in the server (deprecated method)
```lua
function QBCore.Functions.GetPlayers()
	local sources = {}
	for k, v in pairs(QBCore.Players) do
		table.insert(sources, k)
	end
	return sources
end
```

### QBCore.Functions.GetQBPlayers
Access the table of all active players on the server (preferred to above)
```lua
function QBCore.Functions.GetQBPlayers()
	return QBCore.Players
end
```

### QBCore.Functions.CreateCallback
Creates a callback which can be triggered
```lua
function QBCore.Functions.CreateCallback(name, cb)
	QBCore.ServerCallbacks[name] = cb
end
```

### QBCore.Functions.TriggerCallback
Trigger a callback
```lua
function QBCore.Functions.TriggerCallback(name, source, cb, ...)
	local src = source
	if QBCore.ServerCallbacks[name] then
		QBCore.ServerCallbacks[name](src, cb, ...)
	end
end
```

### QBCore.Functions.CreateUseableItem
Register an item as usable
```lua
function QBCore.Functions.CreateUseableItem(item, cb)
	QBCore.UseableItems[item] = cb
end
```

### QBCore.Functions.CanUseItem
Check if an item is registered as usable before attempting use
```lua
function QBCore.Functions.CanUseItem(item)
	return QBCore.UseableItems[item]
end
```

### QBCore.Functions.UseItem
Trigger an item to be used on the player
```lua
function QBCore.Functions.UseItem(source, item)
	local src = source
	QBCore.UseableItems[item.name](src, item)
end
```

### QBCore.Functions.Kick
Kick a player from the server
```lua
function QBCore.Functions.Kick(source, reason, setKickReason, deferrals)
	local src = source
	reason = '\n'..reason..'\n🔸 Check our Discord for further information: '..QBCore.Config.Server.discord
	if setKickReason then
		setKickReason(reason)
	end
	CreateThread(function()
		if deferrals then
			deferrals.update(reason)
			Wait(2500)
		end
		if src then
			DropPlayer(src, reason)
		end
		local i = 0
		while (i <= 4) do
			i = i + 1
			while true do
				if src then
					if(GetPlayerPing(src) >= 0) then
						break
					end
					Wait(100)
					CreateThread(function() 
						DropPlayer(src, reason)
					end)
				end
			end
			Wait(5000)
		end
	end)
end
```

### QBCore.Functions.AddPermission
Give a player a specific permission level
```lua
function QBCore.Functions.AddPermission(source, permission)
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	local plicense = Player.PlayerData.license
	if Player then
		QBCore.Config.Server.PermissionList[plicense] = {
			license = plicense,
			permission = permission:lower(),
		}
		exports.oxmysql:execute('DELETE FROM permissions WHERE license = ?', {plicense})

		exports.oxmysql:insert('INSERT INTO permissions (name, license, permission) VALUES (?, ?, ?)', {
			GetPlayerName(src),
			plicense,
			permission:lower()
		})

		Player.Functions.UpdatePlayerData()
		TriggerClientEvent('QBCore:Client:OnPermissionUpdate', src, permission)
	end
end
```

### QBCore.Functions.RemovePermission
Remove all of the players permissions on the server
```lua
function QBCore.Functions.RemovePermission(source)
	local src = source
	local Player = QBCore.Functions.GetPlayer(src)
	local license = Player.PlayerData.license
	if Player then
		QBCore.Config.Server.PermissionList[license] = nil
		exports.oxmysql:execute('DELETE FROM permissions WHERE license = ?', {license})
		Player.Functions.UpdatePlayerData()
	end
end
```

### QBCore.Functions.HasPermission
Check if a player has the permission level needed
```lua
function QBCore.Functions.HasPermission(source, permission)
	local src = source
	local license = QBCore.Functions.GetIdentifier(src, 'license')
	local permission = tostring(permission:lower())
	if permission == 'user' then
		return true
	else
		if QBCore.Config.Server.PermissionList[license] then
			if QBCore.Config.Server.PermissionList[license].license == license then
				if QBCore.Config.Server.PermissionList[license].permission == permission or QBCore.Config.Server.PermissionList[license].permission == 'god' then
					return true
				end
			end
		end
	end
	return false
end
```

### QBCore.Functions.GetPermission
Get a players permission level
```lua
function QBCore.Functions.GetPermission(source)
	local src = source
	local license = QBCore.Functions.GetIdentifier(src, 'license')
	if license then
		if QBCore.Config.Server.PermissionList[license] then
			if QBCore.Config.Server.PermissionList[license].license == license then
				return QBCore.Config.Server.PermissionList[license].permission
			end
		end
	end
	return 'user'
end
```

### QBCore.Functions.IsPlayerBanned
Check if a player is banned (used for connection)
```lua
function QBCore.Functions.IsPlayerBanned(source)
	local src = source
	local retval = false
	local message = ''
	local plicense = QBCore.Functions.GetIdentifier(src, 'license')
    local result = exports.oxmysql:fetchSync('SELECT * FROM bans WHERE license = ?', {plicense})
    if result[1] then
        if os.time() < result[1].expire then
            retval = true
            local timeTable = os.date('*t', tonumber(result.expire))
            message = 'You have been banned from the server:\n'..result[1].reason..'\nYour ban expires '..timeTable.day.. '/' .. timeTable.month .. '/' .. timeTable.year .. ' ' .. timeTable.hour.. ':' .. timeTable.min .. '\n'
        else
            exports.oxmysql:execute('DELETE FROM bans WHERE id = ?', {result[1].id})
        end
    end
	return retval, message
end
```

### QBCore.Functions.IsLicenseInUse
Prevent duplicate licenses on the server (used for connection)
```lua
function QBCore.Functions.IsLicenseInUse(license)
    local players = GetPlayers()
    for _, player in pairs(players) do
        local identifiers = GetPlayerIdentifiers(player)
        for _, id in pairs(identifiers) do
            if string.find(id, 'license') then
                local playerLicense = id
                if playerLicense == license then
                    return true
                end
            end
        end
    end
    return false
end
```