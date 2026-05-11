// ═══════════════════════════════════════════════════════════════
//  DUNGEON MODULE — RE-based room+corridor generator
//  Replaces old recursive backtracker maze with RE algorithm
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

// ── Constants ─────────────────────────────────────────────────
var DUN_W = 50, DUN_H = 50;
var MAX_FEATURES = 40;

// Direction deltas: 0=UP 1=DOWN 2=LEFT 3=RIGHT
var DIR_DX = [0, 0, -1, 1];
var DIR_DY = [-1, 1, 0, 0];

// ═══════════════════════════════════════════════════════════════
//  RNG HELPERS
// ═══════════════════════════════════════════════════════════════
function rng(max) { return Math.floor(Math.random() * max); }
function rngRange(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = rng(i + 1);
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

// ═══════════════════════════════════════════════════════════════
//  TILE HELPERS
// ═══════════════════════════════════════════════════════════════
function isFloorOrCorridor(ch, includeVariants) {
  if (ch === '.' || ch === ',') return true;
  if (includeVariants) return 'yzqo;ehjkp'.indexOf(ch) >= 0;
  return 'yziqo'.indexOf(ch) >= 0;
}

function isDoorChar(ch) {
  return '+=@~%*_{}'.indexOf(ch) >= 0;
}

function isWallChar(ch) {
  return '#X|x`|'.indexOf(ch) >= 0;
}

// ═══════════════════════════════════════════════════════════════
//  DUNGEON STATE
// ═══════════════════════════════════════════════════════════════
var dun = null;

function initDungeon() {
  dun = {
    map: [],        // 2D ASCII char grid [y][x]
    rects: [],      // placed rooms/corridors {x,y,w,h,type,doors,minDoors,doorTile,subFeats,monCount}
    features: 0,    // number of placed features
    currentFeat: 0,
    floor: 1,
    keyCount: 0,
    shopCount: 0,
    waterCount: 0,
    stairX: 0,
    stairY: 0,
    stairUpX: 0,
    stairUpY: 0,
    totalRooms: 0,
    maxDoors: 17
  };
  // Clear map
  for (var y = 0; y < DUN_H; y++) {
    dun.map[y] = [];
    for (var x = 0; x < DUN_W; x++) dun.map[y][x] = ' ';
  }
}

function getTile(x, y) {
  if (x < 0 || x >= DUN_W || y < 0 || y >= DUN_H) return ' ';
  return dun.map[y][x];
}

function setTile(x, y, ch) {
  if (x >= 0 && x < DUN_W && y >= 0 && y < DUN_H) dun.map[y][x] = ch;
}

// ═══════════════════════════════════════════════════════════════
//  PLACE RECT (Phase 1 helper)
// ═══════════════════════════════════════════════════════════════
function placeRect(rx, ry, rw, rh, fillCh, wallCh) {
  // Bounds check
  if (rx < 1 || ry < 1 || rx + rw >= DUN_W - 1 || ry + rh >= DUN_H - 1) return false;

  // Overlap check — interior must be empty
  for (var y = ry; y < ry + rh; y++)
    for (var x = rx; x < rx + rw; x++)
      if (getTile(x, y) !== ' ') return false;

  // Fill interior
  for (var y = ry; y < ry + rh; y++) {
    for (var x = rx; x < rx + rw; x++) {
      var ch = fillCh;
      // Floor variation
      if (fillCh === '.') {
        var r = Math.random();
        if (r < 0.07) ch = 'y';
        else if (r < 0.14) ch = 'z';
        else if (r < 0.50) ch = 'i';
      }
      // Corridor variation
      if (fillCh === ',') {
        var r2 = Math.random();
        if (r2 < 0.04) ch = 'o';
        else if (r2 < 0.25) ch = 'q';
      }
      setTile(x, y, ch);
    }
  }

  // Fill border (wall tiles)
  for (var bx = rx - 1; bx <= rx + rw; bx++) {
    for (var by = ry - 1; by <= ry + rh; by++) {
      if (bx >= rx && bx < rx + rw && by >= ry && by < ry + rh) continue; // skip interior
      if (bx < 0 || bx >= DUN_W || by < 0 || by >= DUN_H) continue;
      if (getTile(bx, by) === ' ') setTile(bx, by, 'X');
    }
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════
//  MAKE ROOM (Phase 3-4)
// ═══════════════════════════════════════════════════════════════
function makeRoom(x, y, direction, isFirst) {
  var rw, rh, doors;

  if (isFirst) {
    // First room — medium size at map center
    rw = rngRange(4, 6);
    rh = rngRange(4, 6);
    doors = 3;
  } else {
    // Random room: 5 types per RE table
    var roll = rng(100);
    if (roll < 26) {       // 26% — small
      rw = rngRange(2, 3); rh = rngRange(2, 3); doors = 1;
    } else if (roll < 41) { // 15% — long horizontal
      rw = 2; rh = rngRange(4, 6); doors = 2;
    } else if (roll < 56) { // 15% — long vertical
      rw = rngRange(4, 6); rh = 2; doors = 2;
    } else if (roll < 96) { // 40% — medium
      rw = rngRange(3, 5); rh = rngRange(3, 5); doors = 3;
    } else {                // 4% — large
      rw = rngRange(4, 7); rh = rngRange(4, 7); doors = 4;
    }
  }

  // Calculate room origin from direction
  var rx, ry;
  if (isFirst) {
    rx = Math.floor(DUN_W / 2 - rw / 2);
    ry = Math.floor(DUN_H / 2 - rh / 2);
  } else {
    switch (direction) {
      case 0: rx = x - Math.floor(rw / 2); ry = y - rh; break;
      case 1: rx = x - Math.floor(rw / 2); ry = y + 1; break;
      case 2: rx = x - rw; ry = y - Math.floor(rh / 2); break;
      case 3: rx = x + 1; ry = y - Math.floor(rh / 2); break;
    }
  }

  // Place it
  if (!placeRect(rx, ry, rw, rh, '.', '.')) return false;

  // Build sub-features (wall rects for future door placement)
  var subFeats = buildWallRects(rx, ry, rw, rh, direction, isFirst);

  // Record rect
  dun.rects.push({
    x: rx, y: ry, w: rw, h: rh,
    type: 'room',
    doors: doors,
    minDoors: Math.max(0, doors - 1),
    doorTile: '+',
    subFeats: subFeats,
    monCount: Math.max(1, Math.floor((rw * rh) / 4))
  });
  dun.features++;

  // Stair-down on first room
  if (isFirst) {
    var sx = rx + Math.floor(rw / 2);
    var sy = ry + Math.floor(rh / 2);
    setTile(sx, sy, '%');
    dun.stairX = sx;
    dun.stairY = sy;
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════
//  MAKE CORRIDOR (Phase 4)
// ═══════════════════════════════════════════════════════════════
function makeCorridor(x, y, direction) {
  var rw, rh, rx, ry;

  // 50/50 vertical vs horizontal
  if (Math.random() < 0.5) {
    // Vertical corridor
    rw = rngRange(1, 2);
    rh = rngRange(3, 6);
    switch (direction) {
      case 0: rx = x; ry = y - rh; break;
      case 1: rx = x; ry = y + 1; break;
      case 2: rx = x - 1; ry = Math.random() < 0.5 ? y - rh : y; break;
      case 3: rx = x + 1; ry = Math.random() < 0.5 ? y - rh : y; break;
    }
  } else {
    // Horizontal corridor
    rw = rngRange(3, 6);
    rh = rngRange(1, 2);
    switch (direction) {
      case 0: rx = x; ry = y - 1; break;
      case 1: rx = x; ry = y + 1; break;
      case 2: rx = x - rw; ry = y; break;
      case 3: rx = x + 1; ry = y; break;
    }
    // 50% shift origin
    if (Math.random() < 0.5) rx += (rw - 1);
  }

  // Place it
  if (!placeRect(rx, ry, rw, rh, ',', ',')) return false;

  // Build sub-features
  var subFeats = buildWallRects(rx, ry, rw, rh, direction, false);

  // Record rect
  dun.rects.push({
    x: rx, y: ry, w: rw, h: rh,
    type: 'corridor',
    doors: 2,
    minDoors: 1,
    doorTile: '+',
    subFeats: subFeats,
    monCount: Math.max(0, Math.floor((rw * rh) / 6))
  });
  dun.features++;

  return true;
}

// ═══════════════════════════════════════════════════════════════
//  BUILD WALL RECTS (sub-features for door placement)
// ═══════════════════════════════════════════════════════════════
function buildWallRects(rx, ry, rw, rh, entryDir, isFirst) {
  var sides = [];
  // Each side except entry direction gets a wall rect
  // UP (0): top edge, DOWN (1): bottom edge, LEFT (2): left edge, RIGHT (3): right edge
  if (entryDir !== 0) sides.push({ x: rx, y: ry - 1, w: rw, h: 1, dir: 0 });      // top
  if (entryDir !== 1) sides.push({ x: rx, y: ry + rh, w: rw, h: 1, dir: 1 });      // bottom
  if (entryDir !== 2) sides.push({ x: rx - 1, y: ry, w: 1, h: rh, dir: 2 });       // left
  if (entryDir !== 3) sides.push({ x: rx + rw, y: ry, w: 1, h: rh, dir: 3 });      // right
  return sides;
}

// ═══════════════════════════════════════════════════════════════
//  CREATE FEATURE (Phase 4 — main loop driver)
// ═══════════════════════════════════════════════════════════════
function createFeature() {
  // Collect eligible rooms
  var eligible = [];
  for (var i = 0; i < dun.rects.length && eligible.length < 100; i++) {
    var r = dun.rects[i];
    if (r.doors > 0 && r.subFeats.length > 0) eligible.push(i);
  }
  if (eligible.length === 0) return false;
  shuffleArray(eligible);

  // Try each eligible room
  for (var e = 0; e < eligible.length; e++) {
    var ri = eligible[e];
    var rect = dun.rects[ri];

    // Try up to 200 times to find valid position
    for (var attempt = 0; attempt < 200; attempt++) {
      if (rect.subFeats.length === 0) break;

      // Pick random sub-feature
      var sfIdx = rng(rect.subFeats.length);
      var sf = rect.subFeats[sfIdx];

      // Pick random (x,y) within sub-feature
      var px = sf.x + rng(sf.w);
      var py = sf.y + rng(sf.h);

      // Room chance
      var roomChance;
      if (sf.w === 1 || sf.h === 1) {
        roomChance = 85; // narrow wall — force room
      } else if (rect.doors < 2) {
        roomChance = -1; // force corridor
      } else {
        roomChance = 30;
      }

      // Try all 4 directions
      var dirs = [0, 1, 2, 3];
      shuffleArray(dirs);
      for (var d = 0; d < dirs.length; d++) {
        var dir = dirs[d];
        if (tryPlaceFeature(px, py, dir, roomChance)) {
          rect.doors--;
          // Remove used sub-feature
          rect.subFeats.splice(sfIdx, 1);
          return true;
        }
      }
    }
  }

  return false;
}

function tryPlaceFeature(x, y, direction, roomChance) {
  // Direction delta — check tile BEHIND the wall, toward existing room
  var dx = -DIR_DX[direction];
  var dy = -DIR_DY[direction];

  // Verify adjacent tile is floor or corridor
  var adj = getTile(x + dx, y + dy);
  if (!isFloorOrCorridor(adj, true)) return false;

  // Check the wall position itself is a wall
  var wall = getTile(x, y);
  if (wall !== 'X' && wall !== '#' && wall !== ' ') return false;

  // Room vs corridor
  var roll = rng(100);
  var success;
  if (roll < roomChance && dun.features < MAX_FEATURES) {
    success = makeRoom(x, y, direction, false);
  } else {
    success = makeCorridor(x, y, direction);
  }

  if (!success) return false;

  // Set door tile at connection point
  var lastRect = dun.rects[dun.rects.length - 1];
  var doorTile = lastRect.doorTile || '+';
  setTile(x, y, doorTile);

  // Corridor-to-room connection: if adjacent is room floor, convert to corridor
  if (isFloorOrCorridor(adj, false) && adj === '.') {
    setTile(x + dx, y + dy, ',');
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════
//  PLACE STAIR-UP (Phase 4 — after features loop)
// ═══════════════════════════════════════════════════════════════
function placeStairUp() {
  // Find a floor tile far from stair-down
  var floors = [];
  for (var y = 1; y < DUN_H - 1; y++) {
    for (var x = 1; x < DUN_W - 1; x++) {
      var ch = getTile(x, y);
      if (isFloorOrCorridor(ch, true) && ch !== '%' && ch !== '*') {
        var dist = Math.abs(x - dun.stairX) + Math.abs(y - dun.stairY);
        if (dist > 10) floors.push({ x: x, y: y, dist: dist });
      }
    }
  }
  if (floors.length === 0) {
    // Fallback: any floor tile
    for (var y2 = 1; y2 < DUN_H - 1; y2++) {
      for (var x2 = 1; x2 < DUN_W - 1; x2++) {
        if (isFloorOrCorridor(getTile(x2, y2), true)) floors.push({ x: x2, y: y2, dist: 0 });
      }
    }
  }
  if (floors.length === 0) return false;

  // Sort by distance (prefer far from stairs down)
  floors.sort(function(a, b) { return b.dist - a.dist; });
  // Pick from top 20%
  var pick = floors[rng(Math.min(5, Math.max(1, Math.floor(floors.length * 0.2))))];
  setTile(pick.x, pick.y, '*');
  dun.stairUpX = pick.x;
  dun.stairUpY = pick.y;
  return true;
}

// ═══════════════════════════════════════════════════════════════
//  PLACE TRAPS (Phase 8)
// ═══════════════════════════════════════════════════════════════
function placeTraps(floor) {
  if (floor <= 2) return;
  var trapCount = Math.floor(floor / 2) + 2;
  while (Math.random() < 0.5 && trapCount < 16) trapCount++;

  var placed = 0;
  for (var t = 0; t < trapCount * 3 && placed < trapCount; t++) {
    // Pick random rect
    var ri = rng(dun.rects.length);
    var rect = dun.rects[ri];
    if (rect.type === 'corridor' && Math.random() > 0.75) continue;

    // Collect valid positions
    var positions = [];
    for (var y = rect.y; y < rect.y + rect.h; y++) {
      for (var x = rect.x; x < rect.x + rect.w; x++) {
        var ch = getTile(x, y);
        if (isFloorOrCorridor(ch, true) && ch !== '%' && ch !== '*' && ch !== 'T' && ch !== 'M') {
          // 75% chance to require adjacent door, 25% edge
          if (Math.random() < 0.75) {
            if (hasAdjacentDoor(x, y)) positions.push({ x: x, y: y });
          } else {
            positions.push({ x: x, y: y });
          }
        }
      }
    }
    if (positions.length > 0) {
      shuffleArray(positions);
      setTile(positions[0].x, positions[0].y, 'T');
      placed++;
    }
  }
}

function hasAdjacentDoor(x, y) {
  for (var d = 0; d < 4; d++) {
    if (isDoorChar(getTile(x + DIR_DX[d], y + DIR_DY[d]))) return true;
  }
  // Also check diagonals
  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (isDoorChar(getTile(x + dx, y + dy))) return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
//  PLACE MONSTERS (Phase 9)
// ═══════════════════════════════════════════════════════════════
function placeMonsters(floor) {
  var maxMons;
  if (floor <= 5) maxMons = 15;
  else if (floor <= 10) maxMons = 16;
  else maxMons = 18;

  var placed = 0;
  // First pass: place in rooms with monCount > 0
  for (var i = 0; i < dun.rects.length && placed < maxMons; i++) {
    var rect = dun.rects[i];
    var count = Math.min(rect.monCount, maxMons - placed);
    var positions = [];
    for (var y = rect.y; y < rect.y + rect.h && positions.length < 100; y++) {
      for (var x = rect.x; x < rect.x + rect.w && positions.length < 100; x++) {
        var ch = getTile(x, y);
        if (isFloorOrCorridor(ch, true) && ch !== '%' && ch !== '*' && ch !== 'T' && ch !== 'M') {
          positions.push({ x: x, y: y });
        }
      }
    }
    shuffleArray(positions);
    for (var j = 0; j < count && j < positions.length; j++) {
      setTile(positions[j].x, positions[j].y, 'M');
      placed++;
    }
  }

  // Second pass: fill remaining
  for (var pass = 0; pass < 50 && placed < maxMons; pass++) {
    var ri = rng(dun.rects.length);
    var r = dun.rects[ri];
    var pos2 = [];
    for (var y2 = r.y; y2 < r.y + r.h; y2++) {
      for (var x2 = r.x; x2 < r.x + r.w; x2++) {
        var ch2 = getTile(x2, y2);
        if (isFloorOrCorridor(ch2, true) && ch2 !== '%' && ch2 !== '*' && ch2 !== 'T' && ch2 !== 'M') {
          pos2.push({ x: x2, y: y2 });
        }
      }
    }
    if (pos2.length > 0) {
      shuffleArray(pos2);
      setTile(pos2[0].x, pos2[0].y, 'M');
      placed++;
    }
  }

  return placed;
}

// ═══════════════════════════════════════════════════════════════
//  PLACE ITEMS (Phase 10)
// ═══════════════════════════════════════════════════════════════
function placeItems(floor) {
  var itemCount = 4;
  while (Math.random() < 0.5 && itemCount < 10) itemCount++;

  var positions = [];
  for (var i = 0; i < dun.rects.length; i++) {
    var rect = dun.rects[i];
    for (var y = rect.y; y < rect.y + rect.h; y++) {
      for (var x = rect.x; x < rect.x + rect.w; x++) {
        var ch = getTile(x, y);
        if (ch === '.' || ch === ',' || ch === 'o' || ch === 'q') {
          if (Math.random() < 0.5) positions.push({ x: x, y: y });
        } else if ('yzr;ehjkp}i'.indexOf(ch) >= 0) {
          positions.push({ x: x, y: y });
        }
      }
    }
  }

  shuffleArray(positions);
  for (var j = 0; j < itemCount && j < positions.length; j++) {
    setTile(positions[j].x, positions[j].y, '5');
  }
}

// ═══════════════════════════════════════════════════════════════
//  PLACE SHOP (Phase 6 — every 3 floors)
// ═══════════════════════════════════════════════════════════════
function placeShop(floor) {
  if (floor % 3 !== 0 || dun.rects.length < 3) return;
  // Find a suitable room (not the first one with stairs)
  for (var i = 1; i < dun.rects.length; i++) {
    var rect = dun.rects[i];
    if (rect.type !== 'room') continue;
    var cx = rect.x + Math.floor(rect.w / 2);
    var cy = rect.y + Math.floor(rect.h / 2);
    var ch = getTile(cx, cy);
    if (isFloorOrCorridor(ch, false) && ch !== '%' && ch !== '*') {
      setTile(cx, cy, ')');
      return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  KEY / LOCK SYSTEM (Phase 7 — simplified)
// ═══════════════════════════════════════════════════════════════
function placeKeysAndLocks(floor) {
  if (floor <= 1) return; // No locks on first floor

  // Convert some '+' doors to locked doors
  var lockedDoors = [];
  for (var y = 0; y < DUN_H; y++) {
    for (var x = 0; x < DUN_W; x++) {
      if (getTile(x, y) === '+' && Math.random() < 0.15) {
        // Don't lock doors near first room
        var nearFirst = false;
        if (dun.rects.length > 0) {
          var fr = dun.rects[0];
          if (Math.abs(x - (fr.x + fr.w / 2)) < 6 && Math.abs(y - (fr.y + fr.h / 2)) < 6) nearFirst = true;
        }
        if (!nearFirst) {
          setTile(x, y, '@');
          lockedDoors.push({ x: x, y: y });
        }
      }
    }
  }

  // Place unlock keys reachable from stair-up (or start)
  var startX = dun.stairUpX || 1;
  var startY = dun.stairUpY || 1;
  if (dun.rects.length > 0) {
    startX = dun.rects[0].x + Math.floor(dun.rects[0].w / 2);
    startY = dun.rects[0].y + Math.floor(dun.rects[0].h / 2);
  }

  for (var k = 0; k < lockedDoors.length; k++) {
    // Find a reachable floor tile to place the key
    var reachable = floodFill(startX, startY, 20);
    if (reachable.length === 0) break;
    shuffleArray(reachable);
    setTile(reachable[0].x, reachable[0].y, 'U');

    // "Unlock" — convert locked door back to '+' so next key can be placed beyond
    setTile(lockedDoors[k].x, lockedDoors[k].y, '+');
  }
}

// ═══════════════════════════════════════════════════════════════
//  FLOOD FILL (for key placement and path validation)
// ═══════════════════════════════════════════════════════════════
function floodFill(startX, startY, maxDist) {
  var visited = {};
  var queue = [{ x: startX, y: startY, dist: 0 }];
  var result = [];
  var key = function(x, y) { return x + ',' + y; };
  visited[key(startX, startY)] = true;

  while (queue.length > 0) {
    var cur = queue.shift();
    if (cur.dist > maxDist) continue;

    for (var d = 0; d < 4; d++) {
      var nx = cur.x + DIR_DX[d];
      var ny = cur.y + DIR_DY[d];
      var nk = key(nx, ny);
      if (visited[nk]) continue;
      if (nx < 0 || nx >= DUN_W || ny < 0 || ny >= DUN_H) continue;

      var ch = getTile(nx, ny);
      // Can pass through floors and open doors
      if (isFloorOrCorridor(ch, true)) {
        visited[nk] = true;
        queue.push({ x: nx, y: ny, dist: cur.dist + 1 });
        if (ch !== '%' && ch !== '*') result.push({ x: nx, y: ny });
      }
      // Can pass through doors
      else if (ch === '+') {
        visited[nk] = true;
        queue.push({ x: nx, y: ny, dist: cur.dist + 1 });
      }
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════
//  VALIDATE PATH (Phase 12 — BFS check)
// ═══════════════════════════════════════════════════════════════
function validatePath() {
  // Check that stair-down is reachable from stair-up (or start)
  var startX = dun.stairUpX || 1;
  var startY = dun.stairUpY || 1;
  if (dun.rects.length > 0) {
    startX = dun.rects[0].x + Math.floor(dun.rects[0].w / 2);
    startY = dun.rects[0].y + Math.floor(dun.rects[0].h / 2);
  }

  var reachable = floodFill(startX, startY, 100);
  // Check if stair-down is in reachable area
  for (var i = 0; i < reachable.length; i++) {
    if (reachable[i].x === dun.stairX && reachable[i].y === dun.stairY) return true;
  }

  // Also check directly adjacent to stair position
  for (var d = 0; d < 4; d++) {
    var nx = dun.stairX + DIR_DX[d];
    var ny = dun.stairY + DIR_DY[d];
    for (var j = 0; j < reachable.length; j++) {
      if (reachable[j].x === nx && reachable[j].y === ny) return true;
    }
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════
//  ASCII → INTEGER TILE CONVERSION
// ═══════════════════════════════════════════════════════════════
function convertToIntGrid() {
  var TILE = DS.TILE;
  var CHAR_TO_TILE = DS.CHAR_TO_TILE;
  var grid = [];
  for (var y = 0; y < DUN_H; y++) {
    grid[y] = [];
    for (var x = 0; x < DUN_W; x++) {
      var ch = dun.map[y][x];
      var t = CHAR_TO_TILE[ch];
      if (t === undefined) t = 0; // unknown → void
      grid[y][x] = t;
    }
  }
  return grid;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN GENERATOR (replaces old genMaze)
// ═══════════════════════════════════════════════════════════════
DS.genMaze = function genMaze(w, h) {
  var floor = (typeof G !== 'undefined' && G) ? G.floor : 1;
  var maxRetries = 20;

  for (var retry = 0; retry < maxRetries; retry++) {
    initDungeon();
    dun.floor = floor;

    // Phase 0: Door count
    dun.maxDoors = 17;
    while (Math.random() < 0.5 && dun.maxDoors < 24) dun.maxDoors++;

    // Phase 3: Place first room at center
    if (!makeRoom(Math.floor(DUN_W / 2), Math.floor(DUN_H / 2), 0, true)) continue;

    // Phase 4: Create features loop
    dun.totalRooms = 5 + Math.min(floor, 10);
    while (dun.features < dun.totalRooms) {
      if (!createFeature()) break;
    }

    // Place stair-up
    if (!placeStairUp()) continue;

    // Phase 8: Traps
    placeTraps(floor);

    // Phase 7: Keys and locks
    placeKeysAndLocks(floor);

    // Shop
    placeShop(floor);

    // Phase 10: Items
    placeItems(floor);

    // Phase 12: Validate path
    if (!validatePath()) continue;

    // Success! Convert ASCII → integer grid
    var intGrid = convertToIntGrid();

    return {
      grid: intGrid,
      w: DUN_W,
      h: DUN_H,
      sx: dun.stairX,
      sy: dun.stairY,
      stairUpX: dun.stairUpX,
      stairUpY: dun.stairUpY,
      // Keep ASCII map for debugging
      ascii: dun.map.map(function(row) { return row.join(''); }),
      rects: dun.rects
    };
  }

  // Fallback: simple room if all retries fail
  initDungeon();
  placeRect(20, 20, 8, 8, '.', '.');
  setTile(24, 24, '%');
  setTile(22, 22, '*');
  dun.stairX = 24; dun.stairY = 24;
  dun.stairUpX = 22; dun.stairUpY = 22;
  var intGrid2 = convertToIntGrid();
  return { grid: intGrid2, w: DUN_W, h: DUN_H, sx: 24, sy: 24, stairUpX: 22, stairUpY: 22, ascii: dun.map.map(function(r) { return r.join(''); }), rects: dun.rects };
};

// ═══════════════════════════════════════════════════════════════
//  MONSTER SPAWNING (preserved from old module)
// ═══════════════════════════════════════════════════════════════
DS.getFloorDef = function(f) {
  var diff = G ? (G.settings.difficulty==='HARD'?1.3:G.settings.difficulty==='EASY'?0.8:1) : 1;
  return {
    w: DUN_W,
    h: DUN_H,
    mc: Math.min(Math.floor(3+f*1.2), 12),
    mm: (1+(f-1)*0.25) * diff
  };
};

DS.spawnMons = function(f, maze) {
  var fd = DS.getFloorDef(f);
  var pool = DS.MONSTERS.filter(function(m) { return m.tp!=='b' && m.f<=f; });
  var ms = [];
  var floors = [];
  for (var y=1; y<maze.h-1; y++) for (var x=1; x<maze.w-1; x++) {
    var ch = maze.grid[y][x];
    if (ch === DS.TILE.FLOOR && !(x===1&&y===1)) floors.push({x,y});
  }
  floors.sort(function() { return Math.random()-0.5; });
  for (var i=0; i<fd.mc && i<floors.length; i++) {
    var t = pool[Math.floor(Math.random()*pool.length)];
    ms.push(Object.assign({}, t, {x:floors[i].x, y:floors[i].y, hp:Math.floor(t.hp*fd.mm), maxHp:Math.floor(t.hp*fd.mm),
      atk:Math.floor(t.atk*fd.mm), def:Math.floor(t.def*fd.mm), alive:true,
      skillCD: t.skills ? t.skills.map(function(){return 0;}) : [], moveTick:0}));
  }
  // Boss every 2 floors
  if (f%2===0) {
    var bosses = DS.MONSTERS.filter(function(m){return m.tp==='b' && m.f<=f;});
    if (bosses.length>0) {
      var b = bosses[bosses.length-1];
      ms.push(Object.assign({}, b, {x:maze.sx, y:maze.sy, hp:Math.floor(b.hp*fd.mm*1.5), maxHp:Math.floor(b.hp*fd.mm*1.5),
        atk:Math.floor(b.atk*fd.mm*1.5), def:Math.floor(b.def*fd.mm*1.5), alive:true,
        skillCD: b.skills ? b.skills.map(function(){return 0;}) : [], moveTick:0}));
    }
  }
  return ms;
};

// ═══════════════════════════════════════════════════════════════
//  ITEM SPAWNING (preserved from old module)
// ═══════════════════════════════════════════════════════════════
DS.spawnItems = function(maze) {
  var pool = ['health_potion','bread','torch','herb','wood','ore','crystal_shard','beast_hide','monster_bone','water_bottle'];
  var its = [], floors = [];
  for (var y=1; y<maze.h-1; y++) for (var x=1; x<maze.w-1; x++) {
    var ch = maze.grid[y][x];
    if (ch === DS.TILE.FLOOR && !(x===1&&y===1)) floors.push({x,y});
  }
  floors.sort(function() { return Math.random()-0.5; });
  for (var i=0; i<Math.min(3+G.floor, floors.length); i++) {
    its.push({id:pool[Math.floor(Math.random()*pool.length)], x:floors[i].x, y:floors[i].y});
  }
  return its;
};

// ═══════════════════════════════════════════════════════════════
//  FLOOR INIT (preserved from old module)
// ═══════════════════════════════════════════════════════════════
DS.initFloor = function() {
  var fd = DS.getFloorDef(G.floor);
  G.maze = DS.genMaze(fd.w, fd.h);
  G.fog = [];
  for (var y=0; y<G.maze.h; y++) { G.fog[y] = []; for (var x=0; x<G.maze.w; x++) G.fog[y][x] = 0; }

  // Player spawn position
  if (G.floor === 1 || !G.maze.stairUpX) {
    // Floor 1: start in the first room (stair-up area)
    G.px = G.maze.stairUpX || 1;
    G.py = G.maze.stairUpY || 1;
  } else {
    // Floor 2+: start at stair-up position (entered from above)
    G.px = G.maze.stairUpX;
    G.py = G.maze.stairUpY;
    // Consume stair-up tile — it's a one-time entry
    if (G.maze.grid[G.py] && G.maze.grid[G.py][G.px] === DS.TILE.STAIRS) {
      G.maze.grid[G.py][G.px] = DS.TILE.FLOOR;
    }
  }

  DS.revFog(G.px, G.py, Math.floor(DS.totalVis()));
  G.mons = DS.spawnMons(G.floor, G.maze);
  G.items = DS.spawnItems(G.maze);
  G.dayCount++;
  G.diary = ['Day ' + G.dayCount + ' — Floor ' + G.floor];
  if (G.floor > 1) G.diary.push(DS.getDiaryEvt());
  G.toExit = G.mons.filter(function(m){return m.alive;}).length;
  DS.generateShopItems();
  DS.checkAch();
};

// ═══════════════════════════════════════════════════════════════
//  FOG OF WAR (preserved from old module)
// ═══════════════════════════════════════════════════════════════
DS.revFog = function(cx, cy, r) {
  var f = G.fog;
  for (var y=0; y<f.length; y++) for (var x=0; x<f[0].length; x++)
    if (f[y][x]===2) f[y][x] = 1;
  for (var y2=Math.max(0,cy-r); y2<=Math.min(f.length-1,cy+r); y2++)
    for (var x2=Math.max(0,cx-r); x2<=Math.min(f[0].length-1,cx+r); x2++)
      if (Math.sqrt((x2-cx)*(x2-cx)+(y2-cy)*(y2-cy)) <= r) f[y2][x2] = 2;
};
