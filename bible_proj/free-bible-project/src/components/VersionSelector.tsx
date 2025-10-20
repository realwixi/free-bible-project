import type { BibleVersion } from '../types/bible';
import './VersionSelector.css';

interface VersionSelectorProps {
  currentVersion: BibleVersion;
  onVersionChange: (version: BibleVersion) => void;
}

export const VersionSelector = ({ currentVersion, onVersionChange }: VersionSelectorProps) => {
  return (
    <div className="version-selector">
      <label htmlFor="bible-version" className="version-label">Version:</label>
      <select
        id="bible-version"
        value={currentVersion}
        onChange={(e) => onVersionChange(e.target.value as BibleVersion)}
        className="version-select"
      >
        <option value="KJV">King James Version (KJV)</option>
        <option value="NABRE">New American Bible Revised Edition (NABRE)</option>
      </select>
    </div>
  );
};
