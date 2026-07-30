export function requirementProgress(save, requirement) {
  if (requirement.kind === 'photo') {
    return Number(Boolean(save.discoveries?.[requirement.target]));
  }
  if (requirement.kind === 'gather') {
    return save.lifetimeCollected?.[requirement.target] || 0;
  }
  return 0;
}

export function isRequirementComplete(save, requirement) {
  return requirementProgress(save, requirement) >= requirement.count;
}

export function isBiomeRequestComplete(save, biome) {
  return biome.requirements.every((requirement) => isRequirementComplete(save, requirement));
}

export function calculateInventoryValue(inventory, collectibleCatalog) {
  return Object.entries(inventory || {}).reduce((total, [id, count]) => {
    const value = collectibleCatalog[id]?.value || 0;
    return total + value * Math.max(0, Number(count) || 0);
  }, 0);
}
