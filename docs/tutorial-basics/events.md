---
sidebar_position: 1
---

# Events

### QBCore:Client:OnPlayerLoaded
Handles the player loading in after character selection
```lua
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    ShutdownLoadingScreenNui()
    LocalPlayer.state:set('isLoggedIn', true, false)
    SetCanAttackFriendly(PlayerPedId(), true, false)
    NetworkSetFriendlyFireOption(true)
end)
```
### QBCore:Client:OnPlayerUnload
Handles the player logging out to character selection
```lua
RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    LocalPlayer.state:set('isLoggedIn', false, false)
end)
```

### QBCore:Command:TeleportToPlayer
Event used for the /tp id command
```lua
RegisterNetEvent('QBCore:Command:TeleportToPlayer', function(coords)
    local ped = PlayerPedId()
    SetPedCoordsKeepVehicle(ped, coords.x, coords.y, coords.z)
end)
```

### QBCore:Command:TeleportToCoords
Event used for the /tp x y z command
```lua
RegisterNetEvent('QBCore:Command:TeleportToCoords', function(x, y, z)
    local ped = PlayerPedId()
    SetPedCoordsKeepVehicle(ped, x, y, z)
end)
```

### QBCore:Command:GoToMarker
Event used for the /tpm command
```lua
RegisterNetEvent('QBCore:Command:GoToMarker', function()
    local ped = PlayerPedId()
    local blip = GetFirstBlipInfoId(8)
    if DoesBlipExist(blip) then
        local blipCoords = GetBlipCoords(blip)
        for height = 1, 1000 do
            SetPedCoordsKeepVehicle(ped, blipCoords.x, blipCoords.y, height + 0.0)
            local foundGround, zPos = GetGroundZFor_3dCoord(blipCoords.x, blipCoords.y, height + 0.0)
            if foundGround then
                SetPedCoordsKeepVehicle(ped, blipCoords.x, blipCoords.y, height + 0.0)
                break
            end
            Wait(0)
        end
    end
end)
```

### QBCore:Command:SpawnVehicle
Event for client-side vehicle spawning
```lua
RegisterNetEvent('QBCore:Command:SpawnVehicle', function(vehName)
    local ped = PlayerPedId()
    local hash = GetHashKey(vehName)
    if not IsModelInCdimage(hash) then return end
    RequestModel(hash)
    while not HasModelLoaded(hash) do Wait(10) end
    local vehicle = CreateVehicle(hash, GetEntityCoords(ped), GetEntityHeading(ped), true, false)
    TaskWarpPedIntoVehicle(ped, vehicle, -1)
    SetModelAsNoLongerNeeded(vehicle)
	TriggerEvent("vehiclekeys:client:SetOwner", GetVehicleNumberPlateText(vehicle))
end)
```

### QBCore:Command:DeleteVehicle
Event for client-side vehicle deletion
```lua
RegisterNetEvent('QBCore:Command:DeleteVehicle', function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsUsing(ped)
    if veh ~= 0 then
        SetEntityAsMissionEntity(veh, true, true)
        DeleteVehicle(veh)
    else
        local pcoords = GetEntityCoords(ped)
        local vehicles = GetGamePool('CVehicle')
        for k, v in pairs(vehicles) do
            if #(pcoords - GetEntityCoords(v)) <= 5.0 then
                SetEntityAsMissionEntity(v, true, true)
                DeleteVehicle(v)
            end
        end
    end
end)
```

### QBCore:Player:SetPlayerData
Event for assigning player data on character creation
```lua
RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    QBCore.PlayerData = val
end)
```

### QBCore:Player:UpdatePlayerData
Event for updating the player on logout/disconnect
```lua
RegisterNetEvent('QBCore:Player:UpdatePlayerData', function()
    TriggerServerEvent('QBCore:UpdatePlayer')
end)
```

### QBCore:Notify
Event for handling the core notification system when called from server
```lua
RegisterNetEvent('QBCore:Notify', function(text, type, length)
    QBCore.Functions.Notify(text, type, length)
end)
```

### QBCore:Client:TriggerCallback
Event for triggering a callback
```lua
RegisterNetEvent('QBCore:Client:TriggerCallback', function(name, ...)
    if QBCore.ServerCallbacks[name] then
        QBCore.ServerCallbacks[name](...)
        QBCore.ServerCallbacks[name] = nil
    end
end)
```

### QBCore:Client:UseItem
Event for using an item when called from server
```lua
RegisterNetEvent('QBCore:Client:UseItem', function(item)
    TriggerServerEvent('QBCore:Server:UseItem', item)
end)
```
