import { Bone, allPartNames, Skeleton } from "./skeleton";
import { MathUtils } from "./mathUtils";
import { SVGUtils } from "./svgUtils";

const allPartNamesMap = {};
allPartNames.forEach((name) => (allPartNamesMap[name] = 1));

const MIN_CONFIDENCE_PATH_SCORE = 0.3;

export class PoseIllustration {
  constructor(scope) {
    this.scope = scope;
    this.frames = [];
  }

  updateSkeleton(pose, face) {
    this.pose = pose;
    this.face = face;
    this.skeleton.update(pose, face);
    if (!this.skeleton.isValid) {
      return;
    }

    let getConfidenceScore = (p) => {
      return Object.keys(p.skinning).reduce((totalScore, boneName) => {
        let bt = p.skinning[boneName];
        return totalScore + bt.bone.score * bt.weight;
      }, 0);
    };

    this.skinnedPaths.forEach((skinnedPath) => {
      let confidenceScore = 0;
      skinnedPath.segments.forEach((seg) => {
        confidenceScore += getConfidenceScore(seg.point);
        seg.point.currentPosition = Skeleton.getCurrentPosition(seg.point);
        if (seg.handleIn) {
          seg.handleIn.currentPosition = Skeleton.getCurrentPosition(seg.handleIn);
        }
        if (seg.handleOut) {
          seg.handleOut.currentPosition = Skeleton.getCurrentPosition(seg.handleOut);
        }
      });
      skinnedPath.confidenceScore = confidenceScore / (skinnedPath.segments.length || 1);
    });
  }

  draw() {
    if (!this.skeleton.isValid) {
      return;
    }
    let scope = this.scope;
    this.skinnedPaths.forEach((skinnedPath) => {
      if (!skinnedPath.confidenceScore || skinnedPath.confidenceScore < MIN_CONFIDENCE_PATH_SCORE) {
        return;
      }
      let path = new scope.Path({
        fillColor: skinnedPath.fillColor,
        strokeColor: skinnedPath.strokeColor,
        strokeWidth: skinnedPath.strokeWidth,
        closed: skinnedPath.closed,
      });
      skinnedPath.segments.forEach((seg) => {
        path.addSegment(
          seg.point.currentPosition,
          seg.handleIn ? seg.handleIn.currentPosition.subtract(seg.point.currentPosition) : null,
          seg.handleOut ? seg.handleOut.currentPosition.subtract(seg.point.currentPosition) : null
        );
      });
      if (skinnedPath.closed) {
        path.closePath();
      }
      scope.project.activeLayer.addChild(path);
    });
  }

  bindSkeleton(skeleton, skeletonScope, blinking) {
    let items = skeletonScope.project.getItems({ recursive: true });
    items = items.filter((item) => item.parent && item.parent.name && item.parent.name.startsWith("illustration"));
    this.skeleton = skeleton;
    this.skinnedPaths = [];

    if (blinking) {
      var LEyeOpen = skeletonScope.project.getItem({ name: "LEyeOpen" });
      LEyeOpen._radius.height = 0.5;
      var REyeOpen = skeletonScope.project.getItem({ name: "REyeOpen" });
      REyeOpen._radius.height = 0.5;
    } else {
      var LEyeOpen = skeletonScope.project.getItem({ name: "LEyeOpen" });
      LEyeOpen._radius.height = 5.8;
      var REyeOpen = skeletonScope.project.getItem({ name: "REyeOpen" });
      REyeOpen._radius.height = 5.8;
    }

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (SVGUtils.isGroup(item)) {
        this.bindGroup(item, skeleton);
      } else if (SVGUtils.isPath(item)) {
        this.bindPathToBones(item);
      } else if (SVGUtils.isShape(item)) {
        this.bindPathToBones(item.toPath());
      }
    }
  }

  bindGroup(group, skeleton) {
    let paths = [];
    let keypoints = {};
    let items = group.getItems({ recursive: true });
    items.forEach((item) => {
      let partName = item.name ? allPartNames.find((partName) => item.name.startsWith(partName)) : null;
      if (partName) {
        keypoints[partName] = {
          position: item.bounds.center,
          name: partName,
        };
      } else if (SVGUtils.isPath(item)) {
        paths.push(item);
      } else if (SVGUtils.isShape(item)) {
        paths.push(item.toPath());
      }
    });
    let secondaryBones = [];
    let parentBones = skeleton.bones.filter((bone) => keypoints[bone.kp0.name] && keypoints[bone.kp1.name]);
    let nosePos = skeleton.bNose3Nose4.kp1.position;
    if (!parentBones.length) {
      return;
    }

    parentBones.forEach((parentBone) => {
      let kp0 = keypoints[parentBone.kp0.name];
      let kp1 = keypoints[parentBone.kp1.name];
      let secondaryBone = new Bone().set(kp0, kp1, parentBone.skeleton, parentBone.type);
      kp0.transformFunc = MathUtils.getTransformFunc(parentBone.kp0.position, nosePos, kp0.position);
      kp1.transformFunc = MathUtils.getTransformFunc(parentBone.kp1.position, nosePos, kp1.position);
      secondaryBone.parent = parentBone;
      secondaryBones.push(secondaryBone);
    });
    skeleton.secondaryBones = skeleton.secondaryBones.concat(secondaryBones);
    paths.forEach((path) => {
      this.bindPathToBones(path, secondaryBones);
    });
  }

  getWeights(point, bones) {
    let totalW = 0;
    let weights = {};
    bones.forEach((bone) => {
      let d = MathUtils.getClosestPointOnSegment(bone.kp0.position, bone.kp1.position, point).getDistance(point);
      let w = 1 / (d * d);
      weights[bone.name] = {
        value: w,
        bone: bone,
      };
    });

    let values = Object.values(weights).sort((v0, v1) => {
      return v1.value - v0.value;
    });
    weights = {};
    totalW = 0;
    values.forEach((v) => {
      weights[v.bone.name] = v;
      totalW += v.value;
    });
    if (totalW === 0) {
      return {};
    }

    Object.values(weights).forEach((weight) => {
      weight.value /= totalW;
    });

    return weights;
  }

  bindPathToBones(path, selectedBones) {
    let segs = path.segments.map((s) => {
      let collinear = MathUtils.isCollinear(s.handleIn, s.handleOut);
      let bones = selectedBones || this.skeleton.findBoneGroup(s.point);
      let weightsP = this.getWeights(s.point, bones);
      let segment = {
        point: this.getSkinning(s.point, weightsP),
      };
      if (s.handleIn) {
        let pHandleIn = s.handleIn.add(s.point);
        segment.handleIn = this.getSkinning(pHandleIn, collinear ? weightsP : this.getWeights(pHandleIn, bones));
      }
      if (s.handleOut) {
        let pHandleOut = s.handleOut.add(s.point);
        segment.handleOut = this.getSkinning(pHandleOut, collinear ? weightsP : this.getWeights(pHandleOut, bones));
      }
      return segment;
    });
    this.skinnedPaths.push({
      segments: segs,
      fillColor: path.fillColor,
      strokeColor: path.strokeColor,
      strokeWidth: path.strokeWidth,
      closed: path.closed,
    });
  }

  getSkinning(point, weights) {
    let skinning = {};
    Object.keys(weights).forEach((boneName) => {
      skinning[boneName] = {
        bone: weights[boneName].bone,
        weight: weights[boneName].value,
        transform: weights[boneName].bone.getPointTransform(point),
      };
    });
    return {
      skinning: skinning,
      position: point,
      currentPosition: new this.scope.Point(0, 0),
    };
  }
}
